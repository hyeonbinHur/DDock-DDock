import style from './MarketItem.module.css';
import spinner from '../../assets/spinner.svg';
import { useFirestore } from '../../hooks/useFirestore';
// import rightArrow from '../../assets/right.png';
// import leftArrow from '../../assets/left.png';
// import { useState } from 'react';

export default function MarketItem({ document }) {
    const { loading } = useFirestore('MarketItem');

    // const [currentIndex, setCurrentIndex] = useState(0);

    // const currentIndexMinus = () => {
    //     setCurrentIndex((prev) => prev - 1);
    // };
    // const currentIndexPlus = () => {
    //     setCurrentIndex((prev) => prev + 1);
    // };

    return (
        <article className={style.event}>
            {document && (
                <div>
                    <div className={style.imageContainer}>
                        {/* {document.images[currentIndex] && (
                            <img
                                src={leftArrow}
                                className={style.left}
                                onClick={currentIndexMinus}
                            />
                        )} */}

                        <div className={style.userImageContainer}>
                            <img
                                src={document.images[0]}
                                className={style.mItemImage}
                            />
                        </div>

                        {/* {document.images[currentIndex + 1] && (
                            <img
                                src={rightArrow}
                                className={style.right}
                                onClick={currentIndexPlus}
                            />
                        )} */}
                    </div>

                    <h1>{document.title}</h1>
                    <p>{document.description}</p>
                </div>
            )}

            {loading === true && <img src={spinner} />}
            <menu></menu>
        </article>
    );
}
