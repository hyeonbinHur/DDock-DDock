import { Link, useParams } from 'react-router-dom';
// import { useDocument } from '../../hooks/useDocument';
import Comment from '../../components/Comment/Comment';
import { useAuthContext } from '../../hooks/useAuth';
import style from './MarketItemDetail.module.css';
import rightArrow from '../../assets/right.png';
import leftArrow from '../../assets/left.png';
import { useState, useEffect, useRef } from 'react';
import ItemDeleteModal from '../../components/Modal/ItemDeleteModal';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDocument } from '../../api/getDocument';
import { addCommentOnItem, readItem } from '../../store/ItemSlice';

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

    useEffect(() => {
        if (mitemId) {
            const fetchData = async () => {
                setIsLoading(true); // 로딩 시작
                try {
                    const response = await getDocument('MarketItem', mitemId);
                    dispatch(readItem({ item: response }));
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

    const currentIndexMinus = () => {
        setCurrentIndex((prev) => prev - 1);
    };
    const currentIndexPlus = () => {
        setCurrentIndex((prev) => prev + 1);
    };
    // const handleImageLoad = () => {
    //     setLoading(false);
    // };
    function openConfirmModal() {
        modal.current.open();
    }

    return (
        <>
            {!isLoading && reduxItem && (
                <div>
                    <p>{reduxItem.title}</p>
                    <div className={style.imageContainer}>
                        {imageUrls[currentIndex - 1] && (
                            <img
                                src={leftArrow}
                                className={style.left}
                                onClick={currentIndexMinus}
                            />
                        )}

                        <div className={style.userImageContainer}>
                            <img
                                src={imageUrls[currentIndex]}
                                className={style.mItemImage}
                            />
                        </div>
                        {imageUrls[currentIndex + 1] && (
                            <img
                                src={rightArrow}
                                className={style.right}
                                onClick={currentIndexPlus}
                            />
                        )}
                    </div>
                    <p>
                        {currentIndex + 1}/{imageUrls.length}
                    </p>
                    {user && user.uid === reduxItem.userId && (
                        <div>
                            <Link to={`/market/${mitemId}/mupdate`}>
                                Go to edit
                            </Link>
                            <button onClick={() => openConfirmModal()}>
                                delete Item
                            </button>
                            <button
                                onClick={() => dispatch(addCommentOnItem())}
                            >
                                {' '}
                                Hello add Comment
                            </button>
                        </div>
                    )}
                    <Comment serverItem={reduxItem} collection="MarketItem" />
                    <ItemDeleteModal
                        ref={modal}
                        id={mitemId}
                        navigate={navigate}
                        from={'market'}
                    />
                </div>
            )}
        </>
    );
}
