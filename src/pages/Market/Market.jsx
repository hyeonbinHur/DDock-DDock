// import MarketList from '../../components/MarketItem/MarketItemList';
// import { useCollection } from '../../hooks/useCollection';
// import { Link } from 'react-router-dom';
import spinner from '../../assets/spinner.svg';
// import { useQuery } from '@tanstack/react-query';
import { getCollection } from '../../api/getCollection';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCollection,
    plusInterest,
    minusInterest,
} from '../../store/marketCollectionSlice';
// import { useCollection } from '../../hooks/useCollection';
import ItemList from '../../components/Common/ItemList';
import style from '../page.module.css';

export default function MarketPage() {
    // const { document, error, loading } = useCollection('MarketItem', [
    //     'createdAt',
    //     'desc',
    // ]);

    const dispatch = useDispatch();

    const reduxtCollection = useSelector(
        (state) => state.marketCollection.marketItems
    );

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [spinnerContainerCss, setSpinncerContainerCss] = useState(
        style.spinnerContainer
    );

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // 로딩 시작
            try {
                const response = await getCollection('MarketItem', [
                    'createdAt',
                    'desc',
                ]);
                dispatch(fetchCollection({ documents: response }));

                setError(null); // 에러 상태 초기화
            } catch (err) {
                setError(err.message); // 에러 처리
            } finally {
                setIsLoading(false); // 로딩 종료
            }
        };
        if (reduxtCollection.length == 0) {
            console.log('Hello world');
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading) {
            setSpinncerContainerCss();
        } else {
            setSpinncerContainerCss(style.spinnerContainer);
        }
    }, [isLoading]);

    // if (error != false) {
    //     return <div> Error occured from house page</div>;
    // }

    return (
        <div className={spinnerContainerCss}>
            {error ? (
                <p>{error}</p>
            ) : isLoading ? (
                <img src={spinner} className="w-72" />
            ) : (
                <div>
                    <div className="pt-36"></div>

                    <div className="relative text-size text-sm">
                        {/* {reduxtCollection.length > 0 && ( */}
                        <ItemList
                            Items={reduxtCollection}
                            collection={'MarketItem'}
                            addInterest={plusInterest}
                            minusInterest={minusInterest}
                            Topic={'market'}
                        />
                        {/* )} */}
                    </div>
                </div>
            )}
        </div>
    );
}
