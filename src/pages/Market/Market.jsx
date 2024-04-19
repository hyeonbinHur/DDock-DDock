import MarketList from '../../components/MarketItem/MarketItemList';
// import { useCollection } from '../../hooks/useCollection';
import { Link } from 'react-router-dom';
import spinner from '../../assets/spinner.svg';
import { useQuery } from '@tanstack/react-query';
import { getCollection } from '../../api/getCollection';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCollection } from '../../store/marketCollectionSlice';

export default function MarketPage() {
    // const { document, error, loading } = useCollection('MarketItem', [
    //     'createdAt',
    //     'desc',
    // ]);
    const dispatch = useDispatch();
    const reduxDocument = useSelector((state) => state.marketCollection.marketItems);
    const [clientMarketCollection, setClientMarketCollection] = useState(reduxDocument);
    const { data, error, isLoading } = useQuery({
        queryKey: ['MarketItem'],
        queryFn: () => getCollection('MarketItem', ['createdAt', 'desc']),
        cacheTime: Infinity,
        staleTime: Infinity,
    });

    useEffect(() => {
        
        if (!isLoading && !error && data) {
            dispatch(fetchCollection({ documents: data }));
            setClientMarketCollection(reduxDocument)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isLoading, error, dispatch]);

    

    return (
        <div>
            {error ? (
                <p>error</p>
            ) : isLoading ? (
                <img src={spinner} />
            ) : (
                <>
                 <button onClick={()=> {console.log(reduxDocument)}}>console1</button>
                 <button onClick={()=> {console.log(data)}}>console2</button>


                    <Link to="/market/mupload">Add New Item</Link>
                    {error && <p>{error}</p>}
                    {clientMarketCollection.length > 0}{
                    <ul>{data && <MarketList documents={clientMarketCollection} />}</ul>

                    }
                </>
            )}
        </div>
    );
}
