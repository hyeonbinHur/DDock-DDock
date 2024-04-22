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

export default function HouseItemDetailPage() {
    const dispatch = useDispatch();
    const reduxItem = useSelector((state) => state.itemInRedux.item);
    const { hItemId } = useParams();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [currentIndxe, setCurrentIndex] = useState(0);
    const { user } = useAuthContext();
    const modal = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (hItemId) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const Data = await getDocument('HouseItem', hItemId);
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
                            <p>
                                {currentIndxe + 1}/{imageUrls.length}
                            </p>
                        </div>
                        {/* title layout */}
                        <div>
                            <h1>{reduxItem.title}</h1>
                        </div>

                        {user?.uid == reduxItem.userId && (
                            <div>
                                <Link to={`edit`}>go to edit</Link>
                                <button onClick={() => modal.current.open()}>
                                    Delete Item
                                </button>
                            </div>
                        )}

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
                                collection="HouseItem"
                            />
                        </div>
                        <ItemDeleteModal
                            ref={modal}
                            id={hItemId}
                            navigate={navigate}
                            from={'House'}
                            collection="HouseItem"
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
