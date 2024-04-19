import MarketList from '../../components/MarketItem/MarketItemList';
// import { useCollection } from '../../hooks/useCollection';
import { Link } from 'react-router-dom';
import spinner from '../../assets/spinner.svg';
import { useQuery } from '@tanstack/react-query';
import { getCollection } from '../../api/getCollection';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCollection } from '../../store/marketCollectionSlice';
import { useCollection } from '../../hooks/useCollection';


export default function MarketPage() {
    // const { document, error, loading } = useCollection('MarketItem', [
    //     'createdAt',
    //     'desc',
    // ]);
    const dispatch = useDispatch();
    const reduxDocument = useSelector(
        (state) => state.marketCollection.marketItems
    );

    const {document} = useCollection('MarketItem', ['createdAt', 'desc']);
    
    const { data, error, isLoading } = useQuery({   
        queryKey: ['MarketItem'],
        queryFn: () => getCollection('MarketItem', ['createdAt', 'desc']),
        cacheTime: Infinity,
        staleTime: Infinity,
    });
    // const severData = getCollection('MarketItem', ['createdAt', 'desc']);
    useEffect(() => {
        if (!isLoading && !error && data) {
            dispatch(fetchCollection({ documents: data }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isLoading, error]);

    return (
        <div>
            {error ? (
                <p>error</p>
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
                            {data && <MarketList documents={reduxDocument} />}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}
