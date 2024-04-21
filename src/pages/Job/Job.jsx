import { Link } from 'react-router-dom';
import JobItemList from '../../components/JobItem/JobItemList';
import { useDispatch, useSelector } from 'react-redux';
import { getCollection } from '../../api/getCollection';
import { useEffect, useState } from 'react';
import { fetchCollection } from '../../store/jobCollectionSlice';
import spinner from '../../assets/spinner.svg';

export default function JobPage() {
    const dispatch = useDispatch();
    const jobCollectionFromRedux = useSelector(
        (state) => state.jobCollection.jobItems
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

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

        if (jobCollectionFromRedux.length == 0) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    if (error != false) {
        return <div> Error ocuured from job page </div>;
    }

    return (
        <>
            {isLoading ? (
                <img src={spinner} />
            ) : (
                <div>
                    <div> Job Page</div>
                    <Link to="/job/add"> Add Job Page </Link>
                    <p> {jobCollectionFromRedux.length}</p>
                    {jobCollectionFromRedux.length > 0 && (
                        <JobItemList collection={jobCollectionFromRedux} />
                    )}
                </div>
            )}
        </>
    );
}
