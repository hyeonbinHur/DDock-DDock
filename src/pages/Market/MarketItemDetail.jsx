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

import { calculateTime } from '../../util/formDate';
import { formDate2 } from '../../util/formDate';
import { readWriter } from '../../store/ItemSlice';

import UserDropDown from '../../components/DropDown/userDropDown';

export default function MarketItemDetail() {
    const { mitemId } = useParams();
    // const { document, error } = useDocument('MarketItem', mitemId);
    const dispatch = useDispatch();
    const { user } = useAuthContext();
    const [imageUrls, setImageUrls] = useState([]); // 아이템 테이블에서 이미지 받아오기
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

    useEffect(() => {
        if (mitemId) {
            const fetchData = async () => {
                setIsLoading(true); // 로딩 시작
                try {
                    const response = await getDocument('MarketItem', mitemId);
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
    }, [dispatch, mitemId]);

    useEffect(() => {
        if (reduxItem?.images) {
            const emptyArray = []; // 이거 안하면 코드 재시작할때마다 여기 들어와서 imageUrls이 버그냄
            setImageUrls(emptyArray);
            reduxItem.images.map((url) => {
                setImageUrls((prev) => [...prev, url]);
            });
        }
    }, [reduxItem?.images]);

    if (error) {
        return <div className="error">{error}</div>;
    }
    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    // const currentIndexMinus = () => {
    //     setCurrentIndex((prev) => prev - 1);
    // };
    // const currentIndexPlus = () => {
    //     setCurrentIndex((prev) => prev + 1);
    // };
    // const handleImageLoad = () => {
    //     setLoading(false);
    // };
    // function openConfirmModal() {
    //     modal.current.open();
    // }

    const closeUserDropDown = () => {
        setIsUserDropDown((prev) => !prev);
    };

    return (
        <>
            {!error ? (
                !isLoading && reduxItem && reduxItemWriter ? (
                    <div className="pt-36 lg:flex lg:flex-col lg:items-center lg:justify-center">
                        {/* images */}
                        <div className="space-y-6 w-full h-2/3 ">
                            <div className="flex flex-cols items-center justify-center h-5/6 w-full">
                                {currentIndex > 0 && (
                                    <button
                                        onClick={() =>
                                            setCurrentIndex((prev) => prev - 1)
                                        }
                                    >
                                        prev
                                    </button>
                                )}

                                <img
                                    src={imageUrls[currentIndex].url}
                                    className="rounded-lg w-2/3 h-full lg:w-1/3"
                                />

                                {currentIndex + 1 < imageUrls.length && (
                                    <button
                                        onClick={() =>
                                            setCurrentIndex((prev) => prev + 1)
                                        }
                                    >
                                        next
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center justify-center font-bold">
                                {currentIndex + 1}/{imageUrls.length}
                            </div>
                        </div>
                        {/* text div*/}
                        <div className="w-full space-y-5 px-24 lg:w-1/3 lg:px-0">
                            {/* writer */}
                            <div className="flex h-28 justify-between">
                                <div className="relative">
                                    <div className="flex items-center space-x-5 space-y-3">
                                        <img
                                            src={reduxItemWriter.Avatar}
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
                                <div>{reduxItem.location.gu}</div>
                                <div>{reduxItem.location.dong}</div>
                            </div>
                            <div className="border"></div>

                            {/* title layout */}
                            <div className="font-bold text-lg ">
                                <h1>{reduxItem.title}</h1>
                            </div>

                            {/* description layout */}
                            <div className="">
                                <div className="">{reduxItem.description}</div>
                            </div>
                            <div className="border"></div>

                            <div>
                                <Comment
                                    serverItem={reduxItem}
                                    collection="MarketItem"
                                />
                            </div>
                        </div>

                        {/* comment Layout */}

                        <ItemDeleteModal
                            ref={modal}
                            id={mitemId}
                            navigate={navigate}
                            from={'market'}
                            collection="MarketItem"
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
