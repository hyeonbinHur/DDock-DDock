import MarketList from '../../components/MarketItem/MarketItemList';
// import { useCollection } from '../../hooks/useCollection';
import { Link } from 'react-router-dom';
import spinner from '../../assets/spinner.svg';
// import { useQuery } from '@tanstack/react-query';
import { getCollection } from '../../api/getCollection';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCollection } from '../../store/marketCollectionSlice';
// import { useCollection } from '../../hooks/useCollection';

export default function MarketPage() {
    // const { document, error, loading } = useCollection('MarketItem', [
    //     'createdAt',
    //     'desc',
    // ]);

    const dispatch = useDispatch();

    const reduxDocument = useSelector(
        (state) => state.marketCollection.marketItems
    );

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
        if (reduxDocument.length == 0) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <div>
            {error ? (
                <p>
                    {error}
                </p>
            ) : isLoading ? (
                <img src={spinner} />
            ) : (
                <>
                    <button
                        onClick={() => {
                            console.log(reduxDocument);
                        }}
                    >
                        console redux document
                    </button>
                    <button
                        onClick={() => {
                            console.log(document);
                        }}
                    >
                        console sever document
                    </button>

                    <Link to="/market/mupload">Add New Item</Link>
                    {error && <p>{error}</p>}
                    {reduxDocument.length > 0 && (
                        <ul>
                            {reduxDocument && (
                                <MarketList documents={reduxDocument} />
                            )}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}
