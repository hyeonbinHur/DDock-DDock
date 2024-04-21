import JobListItem from './JobListItem';
import { Link } from 'react-router-dom';
import commentPng from '../../assets/comment.png';
import heartPng from '../../assets/heart.png';
import emptyHeart from '../../assets/emptyHeart.png';
import { useAuthContext } from '../../hooks/useAuth';
import style from './JobItemList.module.css';
import { useDocument } from '../../hooks/useDocument';
import { useFirestore } from '../../hooks/useFirestore';
import {
    plusInteresOnJCollection,
    minusInterestOnJCollection,
} from '../../store/jobCollectionSlice';
import { useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import PlaceSettingModal from '../Modal/PlaceSettingModal';

export default function JobItemList({ Items, collection }) {
    const { user } = useAuthContext();
    const { document: userData } = useDocument('User', user?.uid);
    const { updateDocument } = useFirestore('User');
    const dispatch = useDispatch();
    const [searchedContent, setSearchedContent] = useState('');
    const [searchedItem, setSearchedItem] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState('dong');
    const [selectedSi, setSeletedSi] = useState('');
    const [selectedGu, setSeletedGu] = useState('');
    const [selectedDong, setSeletedDong] = useState('');
    const [filterByPlace, setFilterByPlace] = useState([]);

    const placeModal = useRef();

    useEffect(() => {
        const emptyArray = [];
        if (selectedPlace == 'dong') {
            Items.forEach((item) => {
                if (item.location.si == selectedSi) {
                    if (item.location.gu == selectedGu) {
                        if (item.location.dong == selectedDong) {
                            emptyArray.push(item);
                        }
                    }
                }
            });
        } else if (selectedPlace == 'gu') {
            Items.forEach((item) => {
                if (item.location.si == selectedSi) {
                    if (item.location.gu == selectedGu) {
                        emptyArray.push(item);
                    }
                }
            });
        } else if (selectedPlace == 'si') {
            Items.forEach((item) => {
                if (item.location.si == selectedSi) {
                    emptyArray.push(item);
                }
            });
        }

        setFilterByPlace(emptyArray);
    }, [Items, selectedDong, selectedGu, selectedPlace, selectedSi]);

    useEffect(() => {
        const emptyArray = [];
        setSearchedItem(emptyArray);
        filterByPlace.forEach((item) => {
            if (
                item.title.includes(searchedContent) ||
                item.description.includes(searchedContent)
            ) {
                setSearchedItem((prev) => [...prev, item]);
            }
        });
    }, [searchedContent, Items, filterByPlace]);

    useEffect(() => {
        if (userData?.location) {
            setSeletedSi(userData.location.si);
            setSeletedGu(userData.location.gu);
            setSeletedDong(userData.location.dong);
            // setHasedPlace(userInfo.location.dong);
        }
    }, [userData?.location]);

    useEffect(() => {}, []);

    const toggleHeart = async (item, collection, userData) => {
        const interestIndex = userData.interests.findIndex(
            (id) => id == item.id
        );
        if (interestIndex == -1) {
            dispatch(plusInteresOnJCollection({ item: item }));
            const updatedUser = {
                ...userData,
                interests: [...userData.interests, item.id],
            };
            await updateDocument(userData.id, updatedUser, 'User');
            const updatedItem = {
                ...item,
                interests: item.interests + 1,
            };
            await updateDocument(item.id, updatedItem, collection);
        } else {
            dispatch(minusInterestOnJCollection({ item: item }));

            const updatedUserInterests = userData.interests;
            updatedUserInterests.splice(interestIndex, 1);
            const updatedUser = {
                ...userData,
                interests: updatedUserInterests,
            };
            await updateDocument(userData.id, updatedUser, 'User');
            const updatedItem = {
                ...item,
                interests: item.interests - 1,
            };
            await updateDocument(item.id, updatedItem, collection);
        }
    };

    const selectPlace = (event) => {
        setSelectedPlace(event.target.value);
    };

    const placeSetting = (si, gu, dong) => {
        setSeletedSi(si);
        setSeletedGu(gu);
        setSeletedDong(dong);
    };

    return (
        <>
            <div>
                <input
                    type="search"
                    placeholder="찾는 물건을 검색해 보세요"
                    value={searchedContent}
                    onChange={(event) => setSearchedContent(event.target.value)}
                />
            </div>
            <div>
                <span>
                    {selectedSi}{' '}
                    <input
                        type="radio"
                        value="si"
                        checked={selectedPlace == 'si'}
                        onChange={(event) => selectPlace(event)}
                    />
                    /
                </span>

                <span>
                    {selectedGu}{' '}
                    <input
                        type="radio"
                        value="gu"
                        onChange={(event) => selectPlace(event)}
                        checked={selectedPlace == 'gu'}
                    />
                    /
                </span>

                <span>
                    {selectedDong}{' '}
                    <input
                        type="radio"
                        value="dong"
                        onChange={(event) => selectPlace(event)}
                        checked={selectedPlace == 'dong'}
                    />
                    /
                </span>
                <button onClick={()=>placeModal.current.open()}> 내 위치 설정 </button>
            </div>

            <div>
                <ul>
                    {searchedItem.map((item) => (
                        <li key={item.id}>
                            <JobListItem item={item} />
                            <Link to={`/job/${item.id}`}>{item.title}</Link>
                            {userData && (
                                <div>
                                    <img
                                        src={commentPng}
                                        className={style.png}
                                    />
                                    <span>{item.numOfComment}개</span>
                                    {userData.interests.includes(item.id) ? (
                                        <img
                                            src={heartPng}
                                            className={style.png}
                                            onClick={() =>
                                                toggleHeart(
                                                    item,
                                                    collection,
                                                    userData
                                                )
                                            }
                                        />
                                    ) : (
                                        <img
                                            src={emptyHeart}
                                            className={style.png}
                                            onClick={() =>
                                                toggleHeart(
                                                    item,
                                                    collection,
                                                    userData
                                                )
                                            }
                                        />
                                    )}
                                    <span>{item.interests}개</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <PlaceSettingModal
                ref={placeModal}
                placeSettingFn={placeSetting}
                user={userData}
            />
        </>
    );
}
