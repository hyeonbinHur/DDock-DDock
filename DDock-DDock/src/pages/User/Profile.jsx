import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { useState } from 'react';
import { useFirestore } from '../../hooks/useFirestore';

export default function ProfilePage() {
    const { userId } = useParams();
    const { document, error } = useDocument('User', userId);
    const [startEditDisplayName, setStartEditDisplayName] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState('');
    const { updateDocument, loading } = useFirestore('User');

    const changeDisplayName = async () => {
        setStartEditDisplayName(false);
        const originalUser = document;
        const updatedUser = {
            ...originalUser,
            displayName: newDisplayName,
        };
        await updateDocument(userId, updatedUser);
    };

    return (
        <>
            {!document && <p>Loading...</p>}
            {document ? (
                !loading ? (
                    <div>
                        <div>
                            <label>Hello Profile</label>
                        </div>
                        <div>
                            {startEditDisplayName ? (
                                <input
                                    defaultValue={document.displayName}
                                    onChange={(e) =>
                                        setNewDisplayName(e.target.value)
                                    }
                                ></input>
                            ) : (
                                <span>{document.displayName}</span>
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
                        <div>----H ITEM----</div>
                        <div>----J ITEM----</div>
                        <div>----C ITEM----</div>
                    </div>
                ) : (
                    <p>Loading..</p>
                )
            ) : null}

            {error && <p>{error.message}</p>}
        </>
    );
}
