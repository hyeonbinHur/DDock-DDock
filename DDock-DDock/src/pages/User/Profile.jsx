import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { useEffect, useState, useRef } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import MarketList from '../../components/MarketItem/MarketItemList';
import { useCollection } from '../../hooks/useCollection';
import UserCommentForm from '../../components/User/UserCommentForm';
import defaultUserImg from '../../assets/user.png';
import style from './profile.module.css';
import cameraPlus from '../../assets/cameraPlus.png';
import emptyHeart from '../../assets/emptyHeart.png';
import { projectStorage } from '../../firebase/config';
import { v4 as uuidv4 } from 'uuid';
import InterestsItemModal from './interestsModal';




export default function ProfilePage() {
    const { userId } = useParams();
    const { document: user, error: user_error } = useDocument('User', userId);
    const { document: marketItems } = useCollection('MarketItem', [
        'createdAt',
        'desc',
    ]);
    const [startEditDisplayName, setStartEditDisplayName] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState('');
    const { updateDocument, loading } = useFirestore('User');
    const [userMarketItem, setUserMarktItem] = useState([]);

    const [imageUrl, setImageUrl] = useState();
    const [imageUpload, setImageUpload] = useState(null);
    const [imagePreview, setImagePreview] = useState(undefined);
    const fileInputRef = useRef();
    const modal = useRef();

    const [userLoading, setUserLoading] = useState(true); // 맨처음이나, 유저가 정보를 바꾸면 로딩


    function openConfirmModal() {
        if (modal.current) {
            modal.current.open();
        }
    }
    const changeDisplayName = async () => {
        setStartEditDisplayName(false);
        const originalUser = user;
        const updatedUser = {
            ...originalUser,
            displayName: newDisplayName,
        };
        await updateDocument(userId, updatedUser, 'User');
    };

    useEffect(() => {
        //유저 마켓 아이템 로드
        if (user?.userItem && marketItems) {
            const userIds = user.userItem.map((item) => item.id);
            const userItemDetails = marketItems.filter((doc) => {
                return userIds.includes(doc.id);
            });
            setUserMarktItem(userItemDetails);
        }

        if (user?.Avatar) {
            // 유저 아바타 로드
            setImageUrl(user.Avatar);
        }
        if (!user?.Avatar) {
            setUserLoading(false);
        }
    }, [marketItems, user?.userItem, user]);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    function resizeImageToMaxSize(
        file,
        maxWidth,
        maxHeight,
        maxFileSize,
        callback
    ) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            let canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            let quality = 1; // 시작 품질
            const attemptResize = () => {
                canvas.toBlob(
                    (blob) => {
                        if (blob.size > maxFileSize && quality > 0.1) {
                            quality -= 0.1; // 품질 감소
                            canvas.toDataURL('image/jpeg', quality);
                            attemptResize(); // 재귀적으로 품질 조절
                        } else {
                            const resizedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            callback(resizedFile); // 최종 파일 콜백 함수로 반환
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };

            attemptResize();
        };
        img.onerror = (error) => {
            console.error('Error in resizing image: ', error);
        };
    }

    const uploadImage = async () => {
        if (!imageUpload) return;

        setUserLoading(true);
        const maxWidth = 1920;
        const maxHeight = 1080;
        const maxFileSize = 500 * 1024;

        if (user.Avatar) {
            const oldImageRef = projectStorage.refFromURL(user.Avatar);
            try {
                await oldImageRef.delete();
                console.log('Previous image deleted successfully');
            } catch (error) {
                console.error('Error deleting old image:', error);
            }
        }

        resizeImageToMaxSize(
            imageUpload,
            maxWidth,
            maxHeight,
            maxFileSize,
            (resizedFile) => {
                const imageRef = projectStorage.ref(
                    `${userId}/${imageUpload.name}_${uuidv4()}`
                );
                imageRef
                    .put(resizedFile)
                    .then(() => {
                        imageRef.getDownloadURL().then(async (url) => {
                            setImageUrl(url);
                            const originalUser = user;
                            const updatedUser = {
                                ...originalUser,
                                Avatar: url,
                            };
                            await updateDocument(userId, updatedUser, 'User');
                        });
                    })
                    .catch((error) => {
                        console.error('Error uploading image:', error);
                    });
            }
        );
        setUserLoading(false);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImageUpload(file);
        console.log(file);
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result); // 이 결과를 `src`로 사용하여 이미지 미리보기를 보여줍니다.
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            {(!user || userLoading) && <p>Loading...</p>}
            {user && !userLoading ? (
                !loading ? (
                    <div>
                        <input
                            type="file"
                            className={style.fileInput}
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />

                        <div className={style.tmpContainer}>
                            <div>
                                <div className={style.imageContainer}>
                                    <img
                                        className={style.userImage}
                                        src={
                                            imagePreview ||
                                            imageUrl ||
                                            defaultUserImg
                                        }
                                        onLoad={() => setUserLoading(false)}
                                        alt="Default"
                                    />

                                    <div className={style.cameraContainer}>
                                        <img
                                            src={cameraPlus}
                                            className={style.cameraPlus}
                                            onClick={handleImageClick}
                                        />
                                    </div>
                                </div>
                                <button onClick={uploadImage}>
                                    사진 변경 확인
                                </button>
                            </div>

                            <div className={style.heartContainer} >
                                <img src={emptyHeart} className={style.emptyHeart}/>
                                <p>관심 상품</p>
                                <button onClick={openConfirmModal}>open modal</button>
                            </div>
                        </div>

                        <div>
                            <div>
                                <label>Display name</label>
                            </div>
                            {startEditDisplayName ? (
                                <input
                                    defaultValue={user.displayName}
                                    onChange={(e) =>
                                        setNewDisplayName(e.target.value)
                                    }
                                ></input>
                            ) : (
                                <span>{user.displayName}</span>
                            )}
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    if (startEditDisplayName) {
                                        changeDisplayName();
                                    } else {
                                        setStartEditDisplayName(true);
                                    }
                                }}
                            >
                                {startEditDisplayName ? '완료' : '닉네임 변경'}
                            </button>
                        </div>

                        <div>----M ITEM----</div>

                        <MarketList documents={userMarketItem} />

                        <div>----H ITEM----</div>
                        <div>----J ITEM----</div>
                        <div>----C ITEM----</div>
                        <div>---Comments---</div>
                        {user.userComment.length > 0 &&
                            user.userComment.map((comment) => {
                                return (
                                    <UserCommentForm
                                        comment={comment}
                                        key={comment.id}
                                    />
                                );
                            })}
                            <InterestsItemModal ref={modal} itemIds={user.interests} displayName ={user.displayName}/>
                    </div>
                ) : (
                    <p>Loading..</p>
                )
            ) : null}

            {user_error && <p>{user_error.message}</p>}
        </>
    );
}
