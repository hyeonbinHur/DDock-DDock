import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCollection } from '../../api/getCollection';
import { fetchCollection,plusInteresOnCCollection,minusInterestOnCCollection } from '../../store/communityCollectionSlice';
import { useState, useEffect } from 'react';
import spinner from '../../assets/spinner.svg';
import ItemList from '../../components/Common/ItemList';

export default function HousePage() {
    const dispatch = useDispatch();
    const reduxtCollection = useSelector(
        (state) => state.communityCollection.communityItems
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const collection = await getCollection('CommunityItem', [
                    'createdAt',
                    'desc',
                ]);
                dispatch(fetchCollection({ collection: collection }));
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        if (reduxtCollection.length == 0) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    if (error != false) {
        return <div> Error occured from house page</div>;
    }

    return (
        <>
            {isLoading ? (
                <img src={spinner} />
            ) : (
                <div>
                    <div>Community page</div>
                    <Link
                        to={'add'}
                        onClick={() => console.log('hello link click')}
                    >
                        add item
                    </Link>
                    {reduxtCollection.length > 0 && (
                        <ItemList Items={reduxtCollection} collection={'CommunityItem'} addInterest={plusInteresOnCCollection} minusInterest={minusInterestOnCCollection} Topic={"community"}/>
                    )}
                </div>
            )}
        </>
    );
}
