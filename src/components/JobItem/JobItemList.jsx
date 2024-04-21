import JobListItem from './JobListItem';
import { Link } from 'react-router-dom';
import commentPng from '../../assets/comment.png';
import heartPng from '../../assets/heart.png';
import emptyHeart from '../../assets/emptyHeart.png';
import { useAuthContext } from '../../hooks/useAuth';
import style from './JobItemList.module.css';
import { useDocument } from '../../hooks/useDocument';
import { useFirestore } from '../../hooks/useFirestore';
import { plusInteresOnJCollection, minusInterestOnJCollection } from '../../store/jobCollectionSlice';
import { useDispatch } from 'react-redux';


export default function JobItemList({ collection }) {
    const { user } = useAuthContext();
    const { document: userData } = useDocument('User', user?.uid);
    const { updateDocument } = useFirestore('User');
    const dispatch = useDispatch();

    const toggleHeart = async (item, collection, userData) => {
        const interestIndex = userData.interests.findIndex(
            (id) => id == item.id
        );
        if (interestIndex == -1) {
            dispatch(plusInteresOnJCollection({item: item}));
            const updatedUser = {
                ...userData,
                interests: [...userData.interests, item.id],
            };
            await updateDocument(userData.id, updatedUser, 'User');
            const updatedItem = {
                ...item,
                interests: item.interests + 1,
            };
            await updateDocument(item.id, updatedItem, collection);
        } else {
            dispatch(minusInterestOnJCollection({item: item}));

            const updatedUserInterests = userData.interests;
            updatedUserInterests.splice(interestIndex, 1);
            const updatedUser = {
                ...userData,
                interests: updatedUserInterests,
            };
            await updateDocument(userData.id, updatedUser, 'User');
            const updatedItem = {
                ...item,
                interests: item.interests - 1,
            };
            await updateDocument(item.id, updatedItem, collection);
        }
    };
    return (
        <>
            <ul>
                {collection.map((item) => (
                    <li key={item.id}>
                        <JobListItem item={item} />
                        <Link to={`/job/${item.id}`}>{item.title}</Link>
                        {userData && (
                            <div>
                                <img src={commentPng} className={style.png} />
                                <span>{item.numOfComment}개</span>
                                {userData.interests.includes(item.id) ? (
                                    <img
                                        src={heartPng}
                                        className={style.png}
                                        onClick={() => toggleHeart(item, "JobItem", userData)}
                                    />
                                ) : (
                                    <img
                                        src={emptyHeart}
                                        className={style.png}
                                        onClick={() => toggleHeart(item, "JobItem", userData)}
                                    />
                                )}
                                <span>{item.interests}개</span>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
}
