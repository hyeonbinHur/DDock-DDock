import { Link, useParams } from 'react-router-dom';
// import { useDocument } from '../../hooks/useDocument';
import Comment from '../../components/Comment/Comment';
import { useAuthContext } from '../../hooks/useAuth';
// import style from './MarketItemDetail.module.css';
// import rightArrow from '../../assets/right.png';
// import leftArrow from '../../assets/left.png';
import { useState, useEffect, useRef } from 'react';
import ItemDeleteModal from '../../components/Modal/ItemDeleteModal';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDocument } from '../../api/getDocument';
import { readItem } from '../../store/ItemSlice';
import spinner4 from '../../assets/logo/spinner4.svg';

import { calculateTime } from '../../util/formDate';
import { formDate2 } from '../../util/formDate';
import { readWriter } from '../../store/ItemSlice';

import UserDropDown from '../../components/DropDown/userDropDown';
import defUser from '../../assets/user.png';

import { FcPrevious } from 'react-icons/fc';
import { FcNext } from 'react-icons/fc';

import Condition from '../JobItem/Condition';

export default function ItemDetail({ collection, paramKey }) {
    const param = useParams();
    const key = param[paramKey];
    const dispatch = useDispatch();
    const { user } = useAuthContext();
    const [currentIndex, setCurrentIndex] = useState(0);
    const modal = useRef();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const reduxItem = useSelector((state) => state.itemInRedux.item);
    const reduxItemWriter = useSelector((state) => state.itemInRedux.writer);
    const { year, month, day } = formDate2(reduxItem?.createdAt);
    const { result: timeDif, unit: timeString } = calculateTime(
        reduxItem?.createdAt
    );
    const [isUserDropDown, setIsUserDropDown] = useState(false);
    const [from, setFrom] = useState('');

    useEffect(() => {
        if (collection == 'MarketItem') {
            setFrom('market');
        } else if (collection == 'JobItem') {
            setFrom('job');
        } else if (collection == 'HouseItem') {
            setFrom('House');
        } else if (collection == 'CommunityItem') {
            setFrom('Community');
        }
    }, [collection]);

    useEffect(() => {
        if (key) {
            const fetchData = async () => {
                setIsLoading(true); // 로딩 시작
                try {
                    const response = await getDocument(collection, key);
                    dispatch(readItem({ item: response }));
                    const Data = await getDocument('User', response.userId);
                    dispatch(readWriter({ writer: Data }));

                    setError(null); // 에러 상태 초기화
                } catch (err) {
                    setError(err.message); // 에러 처리
                } finally {
                    setIsLoading(false); // 로딩 종료
                }
            };
            fetchData();
        }
    }, [collection, dispatch, key]);

    if (error) {
        return <div className="error">{error}</div>;
    }

    const closeUserDropDown = () => {
        setIsUserDropDown((prev) => !prev);
    };

    if (!reduxItem) {
        return (
            <img
                src={spinner4}
                className="lg:size-72 size-52 absolute top-52 right-[27%] lg:right-[42%]"
            />
        );
    }

    return (
        <>
            {!error ? (
                !isLoading && reduxItem && reduxItemWriter ? (
                    <div className=" lg:flex lg:flex-col lg:items-center lg:justify-center h-full">
                        {/* images */}
                        <div className="space-y-6 w-full h-100 pt-32">
                            <div className="w-full h-5/6  flex justify-center items-center ">
                                <div className="w-20 flex justify-end">
                                    {currentIndex > 0 && (
                                        <div
                                            onClick={() =>
                                                setCurrentIndex(
                                                    (prev) => prev - 1
                                                )
                                            }
                                        >
                                            <FcPrevious className="size-10" />
                                        </div>
                                    )}
                                </div>
                                <div className="rounded-lg w-2/3 h-full  lg:w-1/3">
                                    <img
                                        src={reduxItem.images[currentIndex].url}
                                        className="rounded-lg w-full h-full"
                                    />
                                </div>
                                <div className="w-20">
                                    {currentIndex + 1 <
                                        reduxItem.images.length && (
                                        <div
                                            onClick={() =>
                                                setCurrentIndex(
                                                    (prev) => prev + 1
                                                )
                                            }
                                        >
                                            <FcNext className="size-10" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-center font-bold">
                                {currentIndex + 1}/{reduxItem.images.length}
                            </div>
                        </div>
                        {/* text div*/}
                        <div className="w-full space-y-5 px-24 lg:w-1/3 lg:px-0">
                            {/* writer */}
                            <div className="flex h-28 justify-between">
                                <div className="relative">
                                    <div className="flex items-center space-x-5 space-y-3">
                                        <img
                                            src={
                                                reduxItemWriter.Avatar ||
                                                defUser
                                            }
                                            className="rounded-full h-20 w-20"
                                            onClick={() =>
                                                setIsUserDropDown(
                                                    (prev) => !prev
                                                )
                                            }
                                        />
                                        <div className="font-bold text-xl">
                                            {reduxItemWriter.displayName}
                                        </div>
                                    </div>
                                    <div className="w-56 p-3 z-10 absolute">
                                        {isUserDropDown && (
                                            <UserDropDown
                                                user1={user?.uid}
                                                user2={reduxItemWriter.uid}
                                                closeDropDown={
                                                    closeUserDropDown
                                                }
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="font-light text-sm  grid grid-cols-1 place-items-end ">
                                    {user?.uid == reduxItemWriter.uid && (
                                        <div className="space-y-2 w-5/12">
                                            <div className="w-full border rounded flex justify-center items-center border-sky-300 bg-sky-200 hover:scale-105 hover:text-sky-600">
                                                <Link className="" to={`edit`}>
                                                    Edit
                                                </Link>
                                            </div>

                                            <div
                                                className="border border-red-200 bg-red-100 hover:scale-105 hover:text-red-600 text-center rounded-sm"
                                                onClick={() =>
                                                    modal.current.open()
                                                }
                                            >
                                                Delete
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex space-x-4">
                                        <div>
                                            {month}, {day}, {year}
                                        </div>
                                        <div>
                                            {timeDif} {timeString}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border"></div>
                            {/* location */}
                            <div className="font-light text-sm flex space-x-10">
                                <div>{reduxItem.location.dong}</div>
                            </div>
                            <div className="border"></div>

                            {/* title layout */}
                            <div className="font-bold text-lg ">
                                <h1>{reduxItem.title}</h1>
                            </div>
                            <ul>
                                {reduxItem?.conditions.map((condition) => (
                                    <li key={condition.id}>
                                        <Condition content={condition.value} />
                                    </li>
                                ))}
                            </ul>

                            {/* description layout */}
                            <div className="">
                                <div className="">{reduxItem.description}</div>
                            </div>
                            <div className="border"></div>

                            <div>
                                <Comment
                                    serverItem={reduxItem}
                                    collection={collection}
                                />
                            </div>
                        </div>

                        {/* comment Layout */}

                        <ItemDeleteModal
                            ref={modal}
                            id={key}
                            navigate={navigate}
                            from={from}
                            collection={collection}
                        />
                    </div>
                ) : (
                    <p>Loading</p>
                )
            ) : (
                <p>Hello Error</p>
            )}
        </>
    );
}
