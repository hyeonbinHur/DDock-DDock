import style from './MarketItem.module.css';
import spinner from '../../assets/spinner.svg';
import { useFirestore } from '../../hooks/useFirestore';

// import { useDocument } from '../../hooks/useDocument';
// import UserDropDown from '../DropDown/userDropDown';
// import rightArrow from '../../assets/right.png';
// import leftArrow from '../../assets/left.png';
// import { useState } from 'react';

export default function MarketItem({ document }) {
    const { loading } = useFirestore('MarketItem');

    // const { document: writer, loading: writerLoading } = useDocument(
    //     'User',
    //     document?.userId
    // );

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
                        <div className={style.userImageContainer}>
                            <img
                                src={document.images[0]}
                                className={style.mItemImage}
                            />
                        </div>
                    </div>

                    <h1>{document.title}</h1>
                    <p>{document.description}</p>

                    <span>{document.location.si} 시 </span>
                    <span>{document.location.gu} 구 </span>
                    <span>{document.location.dong} 동 </span>

                    {/* {writerLoading ? (
                        <p>작성자 불러오는중.. </p>
                    ) : (
                        writer && (
                            <div>
                                <UserDropDown writer={writer} />
                            </div>
                        )
                    )} */}
                </div>
            )}

            {loading === true && <img src={spinner} />}
            <menu></menu>
        </article>
    );
}
