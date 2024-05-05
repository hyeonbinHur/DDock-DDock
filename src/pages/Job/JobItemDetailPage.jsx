import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { getDocument } from '../../api/getDocument';
import { readItem } from '../../store/ItemSlice';
import Condition from '../../components/JobItem/Condition';
import Comment from '../../components/Comment/Comment';
import { useAuthContext } from '../../hooks/useAuth';
import ItemDeleteModal from '../../components/Modal/ItemDeleteModal';
import { useNavigate } from 'react-router-dom';
import { formDate2 } from '../../util/formDate';
import { calculateTime } from '../../util/formDate';
import { readWriter } from '../../store/ItemSlice';

export default function JobItemDetailPage() {
    const dispatch = useDispatch();
    const reduxItem = useSelector((state) => state.itemInRedux.item);
    const reduxItemWriter = useSelector((state) => state.itemInRedux.writer);

    const { jItemId } = useParams();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [currentIndxe, setCurrentIndex] = useState(0);
    const { user } = useAuthContext();
    const modal = useRef();
    const navigate = useNavigate();
    const { year, month, day } = formDate2(reduxItem?.createdAt);
    const { result: timeDif, unit: timeString } = calculateTime(
        reduxItem?.createdAt
    );

    useEffect(() => {
        if (jItemId) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const Data = await getDocument('JobItem', jItemId);
                    dispatch(readItem({ item: Data }));
                } catch (error) {
                    setError(error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        if (reduxItem != null && reduxItemWriter == null) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const Data = await getDocument('User', reduxItem.userId);
                    dispatch(readWriter({ writer: Data }));
                } catch (error) {
                    setError(error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, jItemId, reduxItem]);

    useEffect(() => {
        if (reduxItem?.images) {
            const emptyArray = [];
            setImageUrls(emptyArray);
            reduxItem.images.map((url) => {
                setImageUrls((prev) => [...prev, url]);
            });
        }
    }, [reduxItem?.images]);

    return (
        <>
            {!error ? (
                !isLoading && reduxItem && reduxItemWriter ? (
                    <div className="pt-36 lg:flex lg:flex-col lg:items-center lg:justify-center mb-16">
                        <div className="space-y-6 w-full h-2/3 ">
                            <div className="flex flex-cols items-center justify-center h-5/6 w-full">
                                {currentIndxe > 0 && (
                                    <button
                                        onClick={() =>
                                            setCurrentIndex((prev) => prev - 1)
                                        }
                                    >
                                        prev
                                    </button>
                                )}

                                <img
                                    src={reduxItem.images[currentIndxe].url}
                                    className="rounded-lg w-2/3 h-full lg:w-1/3"
                                />

                                {currentIndxe + 1 < imageUrls.length && (
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
                                {currentIndxe + 1}/{imageUrls.length}
                            </div>
                        </div>

                        <div className="w-full space-y-5 px-24 lg:w-1/3 lg:px-0">
                            {/* writer */}
                            <div className="flex h-28 justify-between">
                                <div className="flex items-center space-x-5 space-y-3">
                                    <img
                                        src={reduxItemWriter.Avatar}
                                        className="rounded-full h-20 w-20"
                                    />
                                    <div className="font-bold text-xl">
                                        {reduxItemWriter.displayName}
                                    </div>
                                </div>
                                <div className="font-light text-sm  grid grid-cols-1 place-items-end ">
                                    {user?.uid == reduxItemWriter.id && (
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
                                    collection="JobItem"
                                />
                            </div>
                        </div>

                        <ItemDeleteModal
                            ref={modal}
                            id={jItemId}
                            navigate={navigate}
                            from={'job'}
                            collection="JobItem"
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
