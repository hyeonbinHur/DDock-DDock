import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getDocument } from '../../api/getDocument';
import { readItem } from '../../store/ItemSlice';
import Condition from '../../components/JobItem/Condition';
import Comment from '../../components/Comment/Comment';

export default function JobItemDetailPage() {
    const dispatch = useDispatch();
    const reduxItem = useSelector((state) => state.itemInRedux.item);
    const { jItemId } = useParams();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [currentIndxe, setCurrentIndex] = useState(0);

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
                !isLoading && reduxItem ? (
                    <div>

                        <div>
                            {currentIndxe > 0 && (
                                <button
                                    onClick={() =>
                                        setCurrentIndex((prev) => prev - 1)
                                    }
                                >
                                    prev
                                </button>
                            )}

                            <img src={imageUrls[currentIndxe]} />


                            {currentIndxe + 1 < imageUrls.length && (
                                <button
                                    onClick={() =>
                                        setCurrentIndex((prev) => prev + 1)
                                    }
                                >
                                    next
                                </button>
                            )}
                            <p>{currentIndxe+1}/{imageUrls.length}</p>
                        </div>
                        {/* title layout */}
                        <div>
                            <p>{reduxItem.title}</p>
                            <Link to={`edit`}>go to edit</Link>
                        </div>
                        {/* condition layout */}
                        <ul>
                            {reduxItem.conditions.map((condition) => (
                                <li key={condition.id}>
                                    <Condition content={condition.value} />
                                </li>
                            ))}
                        </ul>
                        {/* description layout */}
                        <div>{reduxItem.description}</div>
                        {/* comment Layout */}
                        <div>
                            <Comment
                                serverItem={reduxItem}
                                collection="JobItem"
                            />
                        </div>
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
