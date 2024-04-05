import MarketItem from './MarketItem';
import ItemDeleteModal from '../Modal/ItemDeleteModal';
import { useEffect, useRef, useState } from 'react';
import commentPng from '../../assets/comment.png';
import heartPng from '../../assets/heart.png';
import emptyHeart from '../../assets/emptyHeart.png';
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

    const [searchTitle, setSearchTitle] = useState('');
    const [searchedItem, setSearchedItem] = useState(documents);


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


    useEffect(()=>{
        console.log("이펙트 들어옴")
        const emptyArray = [];
        setSearchedItem(emptyArray)

        documents.map((document) => {
            if(document.title.includes(searchTitle) || document.description.includes(searchTitle)){
                setSearchedItem((prev) => [...prev, document])
            }
        })

    },[searchTitle, documents])

    return (
        <div>
            <input
                type="search"
                placeholder="찾는 물건을 검색해 보세요"
                value={searchTitle}
                onChange={(event) => setSearchTitle(event.target.value)}
            />
            <ul>
                { searchedItem.map((doc) => (
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
                                            src={emptyHeart}
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
