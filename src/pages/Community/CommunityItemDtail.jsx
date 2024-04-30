import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { getDocument } from '../../api/getDocument';
import { readItem } from '../../store/ItemSlice';
import Comment from '../../components/Comment/Comment';
import { useAuthContext } from '../../hooks/useAuth';
import ItemDeleteModal from '../../components/Modal/ItemDeleteModal';
import { useNavigate } from 'react-router-dom';

export default function CommunityItemDetailPage() {
    const dispatch = useDispatch();
    const reduxItem = useSelector((state) => state.itemInRedux.item);
    const { cItemId } = useParams();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [currentIndxe, setCurrentIndex] = useState(0);
    const { user } = useAuthContext();
    const modal = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (cItemId) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const Data = await getDocument('CommunityItem', cItemId);
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
                    <div className="pt-36 h-screen ">
                        {/* images */}
                        <div className="space-y-6 w-full h-2/3">
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
                                    src={imageUrls[currentIndxe]}
                                    className="rounded-lg w-2/3 h-full"
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
                        {/* text div*/}
                        <div className="w-full space-y-5 px-24">
                            {user?.uid == reduxItem.userId && (
                                <div className="border">
                                    <Link
                                        className="border border-red-200"
                                        to={`edit`}
                                    >
                                        go to edit
                                    </Link>
                                    <button
                                        className="border border-blue-200"
                                        onClick={() => modal.current.open()}
                                    >
                                        Delete Item
                                    </button>
                                </div>
                            )}
                            {/* writer */}
                            <div className="">
                                <div>writer</div>
                            </div>
                            <div className="border"></div>
                            {/* location */}
                            <div>
                                <div>location</div>
                            </div>
                            <div className="border"></div>

                            {/* title layout */}
                            <div className="font-bold text-lg ">
                                <h1>{reduxItem.title}</h1>
                            </div>

                            {/* date */}
                            <div>
                                <div> date </div>
                            </div>

                            <div className="border"></div>

                            {/* description layout */}
                            <div className="">
                                <div className="">{reduxItem.description}</div>
                            </div>
                        </div>

                        {/* comment Layout */}
                        <div>
                            <Comment
                                serverItem={reduxItem}
                                collection="CommunityItem"
                            />
                        </div>
                        <ItemDeleteModal
                            ref={modal}
                            id={cItemId}
                            navigate={navigate}
                            from={'Community'}
                            collection="CommunityItem"
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
