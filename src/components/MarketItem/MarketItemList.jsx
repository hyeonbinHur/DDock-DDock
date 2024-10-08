import MarketItem from './MarketItem';
import ItemDeleteModal from '../Modal/ItemDeleteModal';
import { useEffect, useRef, useState } from 'react';
import commentPng from '../../assets/comment.png';
import heartPng from '../../assets/heart.png';
import emptyHeart from '../../assets/emptyHeart.png';
import style from './MarketItemList.module.css';
import PlaceSettingModal from '../Modal/PlaceSettingModal';
// import style from './MarketItemList.module.css';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuth';
import { useDocument } from '../../hooks/useDocument';
import { useFirestore } from '../../hooks/useFirestore';
import { useDispatch } from 'react-redux';
import { plusInterest, minusInterest } from '../../store/marketCollectionSlice';

export default function MarketList({ documents }) {
    const [deleteItemId, setDeleteItemId] = useState(null);
    const { user } = useAuthContext();
    const modal = useRef();
    const placeModal = useRef();

    const { document: userInfo } = useDocument('User', user?.uid);
    const { updateDocument, response } = useFirestore('User');

    const [searchTitle, setSearchTitle] = useState('');

    const [searchedItem, setSearchedItem] = useState([]);
    const [results, setResults] = useState([]);
    const dispatch = useDispatch();

    const [userSi, setUserSi] = useState('');
    const [userGu, setUserGu] = useState('');
    const [userDong, setUserDong] = useState('');
    const [hasedPlace, setHasedPlace] = useState('');
    const [selectedPlace, setSelectedPlace] = useState('dong');

    useEffect(() => {
        const emptyArray = [];
        setSearchedItem(emptyArray);
        documents.map((document) => {
            if (
                document.title.includes(searchTitle) ||
                document.description.includes(searchTitle)
            ) {
                setSearchedItem((prev) => [...prev, document]);
            }
        });
    }, [searchTitle, documents]);

    useEffect(() => {
        if (userInfo?.location) {
            setUserSi(userInfo.location.si);
            setUserGu(userInfo.location.gu);
            setUserDong(userInfo.location.dong);
            setHasedPlace(userInfo.location.dong);
        }
    }, [userInfo?.location]);

    useEffect(() => {
        const emptyArray = [];
        if (selectedPlace === 'dong') {
            searchedItem.map((item) => {
                if (item.location.si === userSi) {
                    if (item.location.gu === userGu) {
                        if (item.location.dong === userDong) {
                            emptyArray.push(item);
                        }
                    }
                }
            });
        } else if (selectedPlace === 'gu') {
            searchedItem.map((item) => {
                if (item.location.si === userSi) {
                    if (item.location.gu === userGu) {
                        emptyArray.push(item);
                    }
                }
            });
        } else if (selectedPlace === 'si') {
            searchedItem.map((item) => {
                if (item.location.si === userSi) {
                    emptyArray.push(item);
                }
            });
        }
        setResults(emptyArray);
    }, [hasedPlace, searchedItem, selectedPlace, userDong, userGu, userSi]);

    function openPlaceModal() {
        placeModal.current.open();
    }

    function openConfirmModal(itemId) {
        setDeleteItemId(itemId);
        modal.current.open();
    }

    const toggleHeart = async (item) => {
        const originalUser = userInfo;
        const updatedInterests = originalUser.interests;
        const index = updatedInterests.indexOf(item.id);

        if (index > -1) {
            updatedInterests.splice(index, 1);
            dispatch(minusInterest({ id: item.id }));
            const originalItem = item;
            const updatedInterets = item.interests - 1;
            const updatedItem = {
                ...originalItem,
                interests: updatedInterets,
            };
            await updateDocument(item.id, updatedItem, 'MarketItem');
        } else {
            updatedInterests.push(item.id);
            dispatch(plusInterest({ id: item.id }));
            const originalItem = item;
            const updatedInterets = item.interests + 1;
            const updatedItem = {
                ...originalItem,
                interests: updatedInterets,
            };
            await updateDocument(item.id, updatedItem, 'MarketItem');
        }

        const updatedUser = {
            ...originalUser,
            interests: updatedInterests,
        };

        await updateDocument(userInfo.id, updatedUser, 'User');
    };

    // const plusInterest = async (item) => {
    //     const originalClientDocument = clientDocument;
    //     const itemIndex = originalClientDocument.findIndex(
    //         (ogClientItem) => ogClientItem.id === item.id
    //     );

    //     if (itemIndex !== -1) {
    //         // 아이템을 찾았고, 이제 해당 항목의 interests를 1 증가시킵니다.
    //         const updatedClientDocument = [...originalClientDocument]; // 배열을 복사합니다.
    //         updatedClientDocument[itemIndex] = {
    //             ...updatedClientDocument[itemIndex],
    //             interests: updatedClientDocument[itemIndex].interests + 1,
    //         };

    //         // 업데이트된 배열을 상태로 설정합니다.
    //         setClientDocument(updatedClientDocument);
    //     }

    //     const originalItem = item;
    //     const updatedInterets = item.interests + 1;
    //     const updatedItem = {
    //         ...originalItem,
    //         interests: updatedInterets,
    //     };
    //     await updateDocument(item.id, updatedItem, 'MarketItem');
    // };

    // const minusInterest = async (item) => {

    //     const originalClientDocument = clientDocument;
    //     const itemIndex = originalClientDocument.findIndex(
    //         (ogClientItem) => ogClientItem.id === item.id
    //     );

    //     if (itemIndex !== -1) {
    //         const updatedClientDocument = [...originalClientDocument];
    //         updatedClientDocument[itemIndex] = {
    //             ...updatedClientDocument[itemIndex],
    //             interests: updatedClientDocument[itemIndex].interests - 1,
    //         };

    //         setClientDocument(updatedClientDocument);
    //     }

    //     const originalItem = item;
    //     const updatedInterets = item.interests - 1;
    //     const updatedItem = {
    //         ...originalItem,
    //         interests: updatedInterets,
    //     };
    //     await updateDocument(item.id, updatedItem, 'MarketItem');
    // };

    const placeSetting = (si, gu, dong) => {
        setUserSi(si);
        setUserGu(gu);
        setUserDong(dong);
    };

    const changeSelectedPlace = (event) => {
        setSelectedPlace(event.target.value);
        const emptyArray = [];
        if (event.target.value === 'dong') {
            setHasedPlace(userDong);
            searchedItem.map((item) => {
                if (item.location.si === userSi) {
                    if (item.location.gu === userGu) {
                        if (item.location.dong === userGu) {
                            emptyArray.push(item);
                        }
                    }
                }
            });
        } else if (event.target.value === 'gu') {
            setHasedPlace(userGu);
            searchedItem.map((item) => {
                if (item.location.si === userSi) {
                    if (item.location.gu === userGu) {
                        emptyArray.push(item);
                    }
                }
            });
        } else if (event.target.value === 'si') {
            setHasedPlace(userSi);
            searchedItem.map((item) => {
                if (item.location.si === userSi) {
                    emptyArray.push(item);
                }
            });
        }
        setResults(emptyArray);
    };

    return response.error ? (
        <p> {response.error} </p>
    ) : (
        <div>
            <input
                type="search"
                placeholder="찾는 물건을 검색해 보세요"
                value={searchTitle}
                onChange={(event) => setSearchTitle(event.target.value)}
            />

            <button onClick={openPlaceModal}>Open Place modal</button>

            <div>
                <label>{hasedPlace}</label>
            </div>

            <div>
                <input
                    type="radio"
                    value="si"
                    checked={selectedPlace === 'si'}
                    onChange={changeSelectedPlace}
                />
                <label>{userSi} / </label>
                <input
                    type="radio"
                    value="gu"
                    checked={selectedPlace === 'gu'}
                    onChange={changeSelectedPlace}
                />
                <label>{userGu} / </label>

                <input
                    type="radio"
                    value="dong"
                    checked={selectedPlace === 'dong'}
                    onChange={changeSelectedPlace}
                />
                <label>{userDong} / </label>
            </div>

            <ul>
                {results.map((doc, index) => (
                    <li key={index}>
                        <MarketItem document={doc} writer={user?.uid} />
                        <Link to={`/market/${doc.id}`}>{doc.title}</Link>
                        {userInfo && doc.userId === user.uid && (
                            <div>
                                <button
                                    onClick={() => openConfirmModal(doc.id)}
                                >
                                    X
                                </button>
                            </div>
                        )}
                        <div className={style.pngContainer}>
                            <img src={commentPng} className={style.basicPng} />
                            <p>{doc.numOfComment}개</p>

                            {userInfo.interests.includes(doc.id) ? (
                                <img
                                    src={heartPng}
                                    className={style.basicPng}
                                    onClick={() => toggleHeart(doc)}
                                />
                            ) : (
                                <img
                                    src={emptyHeart}
                                    className={style.basicPng}
                                    onClick={() => toggleHeart(doc)}
                                />
                            )}

                            <p>{doc.interests} 개</p>
                        </div>
                    </li>
                ))}
            </ul>
            <ItemDeleteModal ref={modal} id={deleteItemId} />
            <PlaceSettingModal
                ref={placeModal}
                placeSettingFn={placeSetting}
                user={userInfo}
            />
        </div>
    );
}
