// import JobListItem from './JobListItem';
import commentPng from '../../assets/comment.png';
import heartPng from '../../assets/heart.png';
import emptyHeart from '../../assets/emptyHeart.png';
import { useAuthContext } from '../../hooks/useAuth';
import style from './ItemList.module.css';
import { useDocument } from '../../hooks/useDocument';
import { useFirestore } from '../../hooks/useFirestore';
import { useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import PlaceSettingModal from '../Modal/PlaceSettingModal';
import ListHeader from './ListHeader';
import ListItem from './listItem';
import JobListItem from './JobListItem';
import { useNavigate } from 'react-router-dom';

export default function ItemList({
    Items,
    collection,
    addInterest,
    minusInterest,
    Topic,
}) {
    const { user } = useAuthContext();
    const { document: userData } = useDocument('User', user?.uid);
    const { updateDocument } = useFirestore('User');
    const dispatch = useDispatch();
    const [searchedContent, setSearchedContent] = useState('');
    const [searchedItem, setSearchedItem] = useState([]);
    const [selectedPlace, setSeletedPlace] = useState('All Items');
    const [filterByPlace, setFilterByPlace] = useState([]);
    const placeModal = useRef();

    const [listItemCss, setListItemCss] = useState('');
    const [listItemContainerCss, setListItemContainerCss] = useState('');
    const [itemStatusCss, setItemStatusCss] = useState('');
    // const [dateContainerCss, setDateContainerCss] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (Topic == 'community') {
            setListItemCss(style.community_listItem_container);
            setListItemContainerCss(style.community_listItem_container_real);
            setItemStatusCss(style.item_status);
            // setDateContainerCss(style.date_container);
        } else if (Topic == 'house') {
            setListItemCss(style.house_listItem_container);
            setListItemContainerCss(style.house_listItem_container_real);
            setItemStatusCss(style.item_status);
            // setDateContainerCss(style.date_container);
        } else if (Topic == 'job') {
            setListItemCss(style.job_listItem_container);
            setListItemContainerCss(style.job_listItem_container_real);
            setItemStatusCss(style.job_item_status);
            // setDateContainerCss(style.job_date_container);
        } else if (Topic == 'market') {
            setListItemCss(style.market_listItem_container);
            setListItemContainerCss(style.market_listItem_container_real);
            setItemStatusCss(style.item_status);
            // setDateContainerCss(style.date_container);
        }
    }, [Topic]);

    useEffect(() => {
        const emptyArray = [];
        if (selectedPlace === 'All Items') {
            setFilterByPlace(Items);
        } else {
            Items.forEach((item) => {
                if (item.location.dong == selectedPlace) {
                    emptyArray.push(item);
                }
            });
            setFilterByPlace(emptyArray);
        }
    }, [Items, selectedPlace]);

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

    // useEffect(() => {
    //     if (userData?.location) {
    //         setSeletedPlace(userData.location.dong);
    //         // setHasedPlace(userInfo.location.dong);
    //     }
    // }, [userData?.location]);

    const toggleHeart = async (item, collection, userData) => {
        if (!user) {
            navigate('/login');
            return;
        }

        const interestIndex = userData.interests.findIndex(
            (each) => each.id == item.id
        );
        if (interestIndex == -1) {
            dispatch(addInterest({ item: item }));

            const updatedUser = {
                ...userData,
                interests: [...userData.interests, item],
            };
            await updateDocument(userData.id, updatedUser, 'User');
            const updatedItem = {
                ...item,
                interests: item.interests + 1,
            };
            await updateDocument(item.id, updatedItem, collection);
        } else {
            dispatch(minusInterest({ item: item }));
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
    const placeSetting = (dong) => {
        setSeletedPlace(dong);
    };
    const selectPlace = (value) => {
        setSeletedPlace(value);
    };
    const openModal = () => {
        placeModal.current.open();
    };
    const updateSearchContent = (value) => {
        setSearchedContent(value);
    };

    return (
        <>
            <ListHeader
                updateSearchContent={updateSearchContent}
                modalOpenFn={openModal}
                selectPlaceFn={selectPlace}
                topic={Topic}
                //community
            />
            <div className="lg:mx-40 mx-10">
                <div className={listItemCss}>
                    {searchedItem.map((item) => (
                        // 밑에다가 flex h-52
                        <div key={item.id} className={listItemContainerCss}>
                            {Topic == 'job' ? (
                                <JobListItem item={item} topic={Topic} />
                            ) : (
                                <ListItem item={item} topic={Topic} />
                            )}

                            <div className={itemStatusCss}>
                                <div className="flex mr-3">
                                    <img
                                        src={commentPng}
                                        className="w-4 h-4 mr-1"
                                    />
                                    <span>{item.numOfComment}</span>
                                </div>

                                <div className="flex z-10 mx-2">
                                    {userData ? (
                                        userData.interests.some(
                                            (each) => each.id === item.id
                                        ) ? (
                                            <img
                                                src={heartPng}
                                                className="w-4 h-4 mr-1 hover:scale-110"
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
                                                className="w-4 h-4 mr-1 hover:scale-110"
                                                onClick={() =>
                                                    toggleHeart(
                                                        item,
                                                        collection,
                                                        userData
                                                    )
                                                }
                                            />
                                        )
                                    ) : (
                                        <img
                                            src={emptyHeart}
                                            className="w-4 h-4 mr-1 hover:scale-110"
                                            onClick={() =>
                                                toggleHeart(
                                                    item,
                                                    collection,
                                                    userData
                                                )
                                            }
                                        />
                                    )}

                                    <span>{item.interests}</span>
                                </div>

                                {/* <div className={dateContainerCss}>
                                    <span>2 days ago</span>
                                </div> */}
                            </div>
                        </div>
                    ))}
                </div>
                <PlaceSettingModal
                    ref={placeModal}
                    placeSettingFn={placeSetting}
                    user={userData}
                />
            </div>
        </>
    );
}
