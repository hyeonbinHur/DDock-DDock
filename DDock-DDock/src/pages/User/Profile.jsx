import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { useEffect, useState } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import MarketList from '../../components/MarketItem/MarketItemList';
import { useCollection } from '../../hooks/useCollection';

export default function ProfilePage() {
    const { userId } = useParams();
    const { document: user, error: user_error } = useDocument('User', userId);
    const { document: marketItems,  } = useCollection('MarketItem', ['createdAt', 'desc']);


    const [startEditDisplayName, setStartEditDisplayName] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState('');
    const { updateDocument, loading } = useFirestore('User');

    const [userMarketItem, setUserMarktItem] = useState([]);

    const changeDisplayName = async () => {
        setStartEditDisplayName(false);
        const originalUser = user;
        const updatedUser = {
            ...originalUser,
            displayName: newDisplayName,
        };
        await updateDocument(userId, updatedUser);
    };
    useEffect(() => {
    
        if (user?.userItem && marketItems) {
            const userIds = user.userItem.map(item => item.id);
            const userItemDetails = marketItems.filter((doc) => {
                return userIds.includes(doc.id);
            });
            setUserMarktItem(userItemDetails);
        }
    }, [marketItems, user?.userItem, user]);



    return (
        <>
            {!user && <p>Loading...</p>}
            {user ? (
                !loading ? (
                    <div>
                        <div>
                            <label>Hello Profile</label>
                        </div>
                        <div>
                            {startEditDisplayName ? (
                                <input
                                    defaultValue={user.displayName}
                                    onChange={(e) =>
                                        setNewDisplayName(e.target.value)
                                    }
                                ></input>
                            ) : (
                                <span>{user.displayName}</span>
                            )}
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    if (startEditDisplayName) {
                                        changeDisplayName();
                                    } else {
                                        setStartEditDisplayName(true);
                                    }
                                }}
                            >
                                {startEditDisplayName ? '완료' : '닉네임 변경'}
                            </button>
                        </div>

                        <div>----M ITEM----</div>
                        {userMarketItem.length > 0 ? (
                            <MarketList documents={userMarketItem} />
                        ) : null}
                        <div>----H ITEM----</div>
                        <div>----J ITEM----</div>
                        <div>----C ITEM----</div>
                        <div>---Comments---</div>
                        

                    </div>
                ) : (
                    <p>Loading..</p>
                )
            ) : null}

            {user_error && <p>{user_error.message}</p>}
        </>
    );
}
