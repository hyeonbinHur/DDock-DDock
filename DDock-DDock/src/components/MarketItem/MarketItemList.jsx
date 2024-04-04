import MarketItem from './MarketItem';
import ItemDeleteModal from '../Modal/ItemDeleteModal';
import { useRef, useState } from 'react';
import commentPng from '../../assets/comment.png';
import heartPng from '../../assets/heart.png';
import EmptyHeartPng from '../../assets/emptyHeart.png';
import style from './MarketItemList.module.css';

// import style from './MarketItemList.module.css';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuth';
import { useDocument } from '../../hooks/useDocument';
import { useFirestore } from '../../hooks/useFirestore';

export default function MarketList({ documents }) {
    const [deleteItemId, setDeleteItemId] = useState(null);
    const { user } = useAuthContext();
    const modal = useRef();

    const { document: userInfo } = useDocument('User', user.uid);

    const { updateDocument } = useFirestore('User');

    function openConfirmModal(itemId) {
        setDeleteItemId(itemId);
        modal.current.open();
    }

    const toggleHeart = async (item) => {
        const originalUser = userInfo;
        const updatedInterests = originalUser.interests;

        const index = updatedInterests.indexOf(item.id);
        if (index > -1) {
            updatedInterests.splice(index, 1);
            minusInterest(item);
        } else {
            updatedInterests.push(item.id);
            plusInterest(item);
        }

        const updatedUser = {
            ...originalUser,
            interests: updatedInterests,
        };

        await updateDocument(userInfo.id, updatedUser, 'User');
    };

    const plusInterest = async (item) => {
        const originalItem = item;
        const updatedInterets = item.interests + 1;
        const updatedItem = {
            ...originalItem,
            interests: updatedInterets,
        };
        await updateDocument(item.id, updatedItem, 'MarketItem');
    };

    const minusInterest = async (item) => {
        const originalItem = item;
        const updatedInterets = item.interests - 1;
        const updatedItem = {
            ...originalItem,
            interests: updatedInterets,
        };
        await updateDocument(item.id, updatedItem, 'MarketItem');
    };

    const hello = () => {
        console.log(userInfo);
    };

    return (
        <div>
            <button onClick={hello}>user info</button>

            <ul>
                {documents.map((doc) => (
                    <li key={doc.id}>
                        <Link to={`/market/${doc.id}`}>
                            <MarketItem document={doc} />
                        </Link>
                        {userInfo && doc.userId === user.uid && (
                            <div>
                                <button
                                    onClick={() => openConfirmModal(doc.id)}
                                >
                                    X
                                </button>

                                <div className={style.pngContainer}>
                                    <img
                                        src={commentPng}
                                        className={style.basicPng}
                                    />
                                    <p>
                                        {doc.comments.reduce(
                                            (acc, comment) =>
                                                acc +
                                                1 +
                                                (comment.childComment
                                                    ? comment.childComment
                                                          .length
                                                    : 0),
                                            0
                                        )}{' '}
                                        개
                                    </p>

                                    {userInfo.interests.includes(doc.id) ? (
                                        <img
                                            src={heartPng}
                                            className={style.basicPng}
                                            onClick={() => toggleHeart(doc)}
                                        />
                                    ) : (
                                        <img
                                            src={EmptyHeartPng}
                                            className={style.basicPng}
                                            onClick={() => toggleHeart(doc)}
                                        />
                                    )}

                                    <p>{doc.interests} 개</p>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <ItemDeleteModal ref={modal} id={deleteItemId} />
        </div>
    );
}
