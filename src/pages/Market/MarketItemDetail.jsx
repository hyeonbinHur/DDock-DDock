import { Link, useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import Comment from '../../components/Comment/Comment';
import { useAuthContext } from '../../hooks/useAuth';
import style from './MarketItemDetail.module.css';
import rightArrow from '../../assets/right.png';
import leftArrow from '../../assets/left.png';

import { useState, useEffect } from 'react';

export default function MarketItemDetail() {
    const { mitemId } = useParams();
    const { document, error } = useDocument('MarketItem', mitemId);
    const { user } = useAuthContext();

    const [imageUrls, setImageUrls] = useState([]); // 아이템 테이블에서 이미지 받아오기
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (document?.images) {
            const emptyArray = []; // 이거 안하면 코드 재시작할때마다 여기 들어와서 imageUrls이 버그냄
            setImageUrls(emptyArray);
            document.images.map((url) => {
                setImageUrls((prev) => [...prev, url]);
            });
        }
    }, [document?.images]);

    if (error) {
        return <div className="error">{error}</div>;
    }
    if (!document) {
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


    return (
        <>
            <p>{document.title}</p>
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
                {currentIndex+1}/{imageUrls.length}
            </p>
            {user && user.uid === document.userId && (
                <Link to={`/market/${mitemId}/mupdate`}>Go to edit</Link>
            )}

            <Comment serverItem={document} collection="MarketItem" />
        </>
    );
}
