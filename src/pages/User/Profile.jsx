import { FcConferenceCall } from 'react-icons/fc';
// import { FaCommentAlt } from 'react-icons/fa';
import { FcHome } from 'react-icons/fc';
import { FcMoneyTransfer } from 'react-icons/fc';
import { AiOutlineShop } from 'react-icons/ai';
import { FcLike } from 'react-icons/fc';
import { TbCameraPlus } from 'react-icons/tb';
// import { TbBrandPocket } from 'react-icons/tb';
// import { CgPocket } from 'react-icons/cg';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { useEffect, useState, useRef } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { useCollection } from '../../hooks/useCollection';
// import UserCommentForm from '../../components/User/UserCommentForm';
import defaultUserImg from '../../assets/user.png';
import style from './profile.module.css';
// import cameraPlus from '../../assets/cameraPlus.png';
// import emptyHeart from '../../assets/emptyHeart.png';
import { projectStorage } from '../../firebase/config';
import { v4 as uuidv4 } from 'uuid';
import InterestsItemModal from './interestsModal';
import UserItemsPopUp from './UserItemsPopUp';

export default function ProfilePage() {
    const { userId } = useParams(); //꼭 필요

    const {
        document: user,
        error: user_error,
        loading: user_loading,
    } = useDocument('User', userId);

    const { document: marketItems } = useCollection('MarketItem', [
        'createdAt',
        'desc',
    ]);

    const [startEditDisplayName, setStartEditDisplayName] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState('');
    const { updateDocument, loading: updateLoading } = useFirestore('User');
    const [userMarketItem, setUserMarktItem] = useState([]);
    const [imageUrl, setImageUrl] = useState();
    const [imageUpload, setImageUpload] = useState(null);
    const [imagePreview, setImagePreview] = useState(undefined);
    const fileInputRef = useRef();
    const modal = useRef();

    const [isLikeOpen, setIsLikeOepn] = useState(false);
    const [isMarketOpen, setIsMarketOpen] = useState(false);
    const [isJobOpen, setIsJobOpen] = useState(false);
    const [isHouseOpen, setIsHouseOpen] = useState(false);
    const [isCommunityOpen, setIsCommunityOpen] = useState(false);
    const [isCommentOpen, setIsCommpentOpen] = useState(false);
    const [imageLoading, setImageloading] = useState(false);

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
            setImageloading(true);
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

            let quality = 1;
            const attemptResize = () => {
                canvas.toBlob(
                    (blob) => {
                        if (blob.size > maxFileSize && quality > 0.1) {
                            quality -= 0.1;
                            canvas.toDataURL('image/jpeg', quality);
                            attemptResize();
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
                            setImageUrl(url);
                            setImagePreview(undefined);
                        });
                    })
                    .catch((error) => {
                        console.error('Error uploading image:', error);
                    });
            }
        );
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

    const openItems = (content) => {
        if (content == 'Like') {
            setIsLikeOepn(!isLikeOpen);
            setIsMarketOpen(false);
            setIsJobOpen(false);
            setIsHouseOpen(false);
            setIsCommunityOpen(false);
            setIsCommpentOpen(false);
        } else if (content == 'Market') {
            setIsLikeOepn(false);
            setIsMarketOpen(!isMarketOpen);
            setIsJobOpen(false);
            setIsHouseOpen(false);
            setIsCommunityOpen(false);
            setIsCommpentOpen(false);
        } else if (content == 'Job') {
            setIsLikeOepn(false);
            setIsMarketOpen(false);
            setIsJobOpen(!isJobOpen);
            setIsHouseOpen(false);
            setIsCommunityOpen(false);
            setIsCommpentOpen(false);
        } else if (content == 'House') {
            setIsLikeOepn(false);
            setIsMarketOpen(false);
            setIsJobOpen(false);
            setIsHouseOpen(!isHouseOpen);
            setIsCommunityOpen(false);
            setIsCommpentOpen(false);
        } else if (content == 'Community') {
            setIsLikeOepn(false);
            setIsMarketOpen(false);
            setIsJobOpen(false);
            setIsHouseOpen(false);
            setIsCommunityOpen(!isCommunityOpen);
            setIsCommpentOpen(false);
        } else if (content == 'Comment') {
            setIsLikeOepn(false);
            setIsMarketOpen(false);
            setIsJobOpen(false);
            setIsHouseOpen(false);
            setIsCommunityOpen(false);
            setIsCommpentOpen(!isCommentOpen);
        }
    };

    return (
        <>
            {user_error ? (
                <p>{user_error.message}</p>
            ) : user && !updateLoading && !user_loading ? (
                <div className="pt-28 px-7 space-y-3">
                    <input
                        type="file"
                        className={style.fileInput}
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    {/* image div */}
                    <div className="flex items-center justify-between px-9 mt-5">
                        <div>
                            <div className="flex transform">
                                <img
                                    className={style.userImage}
                                    src={
                                        imagePreview ||
                                        imageUrl ||
                                        imageLoading ||
                                        defaultUserImg
                                    }
                                    onLoad={() => setImageloading(false)}
                                    alt="Default"
                                />

                                <div
                                    onClick={handleImageClick}
                                    className="hover:scale-110 absolute rounded-full p-1 top-[80%] right-[10%] bg-gray-200 borer-5"
                                >
                                    <TbCameraPlus className="size-9" />
                                </div>
                            </div>
                            {/* <button  className="border">
                                사진 변경 확인
                            </button> */}
                        </div>

                        <div
                            onClick={uploadImage}
                            className={`${
                                imagePreview == undefined && `hidden`
                            } bg-blue-100 p-2  rounded-lg shadow-md absolute top-[13%] right-[11%] cursor-pointer hover:scale-110`}
                        >
                            Update
                        </div>

                        <div
                            className="border rounded-full p-2 shadow-md hover:scale-110"
                            onClick={openConfirmModal}
                        >
                            <FcLike className=" size-10" />
                        </div>
                    </div>
                    {/* display name div */}
                    <div className="space-y-3">
                        <div className="pt-5 w-36">
                            {startEditDisplayName ? (
                                <div className="w-full">
                                    <input
                                        defaultValue={user.displayName}
                                        onChange={(e) =>
                                            setNewDisplayName(e.target.value)
                                        }
                                        className="border w-full rounded-md"
                                    ></input>
                                </div>
                            ) : (
                                <div>{user.displayName}</div>
                            )}
                        </div>
                        <div className="space-x-3">
                            <button
                                className="border p-1 cursor-pointer hover:scale-110 rounded-lg bg-blue-200 italic"
                                onClick={() => {
                                    if (startEditDisplayName) {
                                        changeDisplayName();
                                    } else {
                                        setStartEditDisplayName(true);
                                    }
                                }}
                            >
                                {startEditDisplayName
                                    ? 'Update'
                                    : 'Change display name'}
                            </button>
                            {startEditDisplayName && (
                                <button
                                    onClick={() =>
                                        setStartEditDisplayName(false)
                                    }
                                    className="border p-1 cursor-pointer hover:scale-110 rounded-lg bg-red-200 italic"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    {/* {userMarketItem.map((item) => (
                        <li key={item.id}>
                            <Link to={`/market/${item.id}`}>
                                <MarketItem document={item} />
                            </Link>
                        </li>
                    ))} */}
                    <div className="border-dotted w-full border"></div>
                    <div className="space-y-5">
                        <div className="font-bold text-xl">My Items</div>
                        <ul className="space-y-2 bg-gray-100 rounded-lg p-2">
                            <li className="p-1">
                                <div
                                    onClick={() => openItems('Like')}
                                    className="flex space-x-3 hover:bg-white w-full rounded-md "
                                >
                                    <FcLike className="mr-2" /> Like
                                </div>
                            </li>

                            {/* {isLikeOpen && (
                                <div>
                                    <UserItemsPopUp
                                        items={user.Mitem}
                                        topic="market"
                                    />
                                </div>
                            )} */}

                            <li className="p-1">
                                <div className="flex  hover:bg-white w-full rounded-md ">
                                    <AiOutlineShop className="mr-2" />
                                    Market
                                </div>
                            </li>
                            {isMarketOpen && (
                                <div>
                                    <UserItemsPopUp
                                        items={user.MItem}
                                        topic="market"
                                    />
                                </div>
                            )}

                            <li className="p-1">
                                <div className="flex space-x-2 hover:bg-white w-full rounded-md ">
                                    <FcMoneyTransfer className="mr-2" />
                                    Job
                                </div>
                            </li>
                            {isJobOpen && (
                                <div>
                                    <UserItemsPopUp
                                        items={user.JItem}
                                        topic="job"
                                    />
                                </div>
                            )}

                            <li className="p-1">
                                <div className="flex space-x-2 hover:bg-white w-full rounded-md ">
                                    <FcHome className="mr-2" />
                                    House
                                </div>
                            </li>
                            {isHouseOpen && (
                                <div>
                                    <UserItemsPopUp
                                        items={user.HItem}
                                        topic="house"
                                    />
                                </div>
                            )}
                            <li
                                onClick={() => openItems('Community')}
                                className="p-1"
                            >
                                <div className="flex space-x-2 hover:bg-white w-full rounded-md ">
                                    <FcConferenceCall className="mr-2" />
                                    Community
                                </div>
                            </li>
                            {isCommunityOpen && (
                                <div>
                                    <UserItemsPopUp
                                        items={user.CItem}
                                        topic="community"
                                    />
                                </div>
                            )}
                        </ul>
                    </div>

                    {/* {user.userComment.length > 0 &&
                        user.userComment.map((comment) => {
                            return (
                                <UserCommentForm
                                    comment={comment}
                                    currentUser={user}
                                    key={comment.id}
                                />
                            );
                        })} */}
                    {/* <InterestsItemModal
                        ref={modal}
                        itemIds={user.interests}
                        displayName={user.displayName}
                    /> */}
                </div>
            ) : (
                <p>Loading..</p>
            )}
        </>
    );
}
