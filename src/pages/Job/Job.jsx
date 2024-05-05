// import { Link } from 'react-router-dom';
// import JobItemList from '../../components/JobItem/JobItemList';
import ItemList from '../../components/Common/ItemList';
import { useDispatch, useSelector } from 'react-redux';
import { getCollection } from '../../api/getCollection';
import { useEffect, useState } from 'react';
import {
    fetchCollection,
    plusInteresOnJCollection,
    minusInterestOnJCollection,
} from '../../store/jobCollectionSlice';
import spinner from '../../assets/spinner.svg';
import style from '../page.module.css';

export default function JobPage() {
    const dispatch = useDispatch();
    const reduxtCollection = useSelector(
        (state) => state.jobCollection.jobItems
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [spinnerContainerCss, setSpinncerContainerCss] = useState(
        style.spinnerContainer
    );

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const collection = await getCollection('JobItem', [
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
    useEffect(() => {
        if (!isLoading) {
            setSpinncerContainerCss();
        } else {
            setSpinncerContainerCss(style.spinnerContainer);
        }
    }, [isLoading]);

    if (error != false) {
        return <div> Error ocuured from job page </div>;
    }

    return (
        <div className={spinnerContainerCss}>
            {isLoading ? (
                <img src={spinner} />
            ) : (
                <div>
                    <div className="pt-36"></div>

                    <div className="relative text-size text-sm">
                        <ItemList
                            Items={reduxtCollection}
                            collection={'JobItem'}
                            addInterest={plusInteresOnJCollection}
                            minusInterest={minusInterestOnJCollection}
                            Topic={'job'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
