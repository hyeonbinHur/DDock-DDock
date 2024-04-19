import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { timestamp } from '../../firebase/config';
import CommentForm from './CommentFom';
import { useDocument } from '../../hooks/useDocument';

export default function Comment({ serverItem, collection }) {
    const { updateDocument, response } = useFirestore(collection);
    const { user } = useAuthContext();
    const { updateDocument: updateUser } = useFirestore('User');
    const { document: userInfo } = useDocument('User', user.uid);
    const [comment, setComment] = useState('');
    const [clientComments, setClientComments] = useState([]);

    useEffect(() => {
        setClientComments(serverItem.comments);
    }, [serverItem.comments]);

    const addComment = async (event) => {
    
        event.preventDefault();
        setComment('');

        const addedComment = {
            displayName: user.displayName,
            userId: user.uid,
            content: comment,
            createdAt: timestamp.fromDate(new Date()),
            id: Math.random(),
            childComment: [],
            serverItemId: serverItem.id,
        };
        setClientComments((prevState) => [...prevState, addedComment]);

        await updateDocument(
            serverItem.id,
            {
                comments: [...serverItem.comments, addedComment],
            },
            collection
        );
        const originalUser = userInfo;
        const originalUserComment = originalUser.userComment;
        const updatedUserComment = [...originalUserComment, addedComment];
        originalUser.userComment = updatedUserComment;

        await updateUser(user.uid, originalUser, 'User');
    };

    return response.error ? (
        <p>error</p>
    ) : (
        <div>
            <h4>ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</h4>
            <h4>Comments</h4>
            <form onSubmit={addComment}>
                <label>
                    <span>add new comment</span>
                    <textarea
                        onChange={(event) => setComment(event.target.value)}
                        value={comment}
                    ></textarea>
                </label>
                <button>submit</button>
            </form>
            <ul>
                {clientComments.length > 0 &&
                    clientComments.map((clientComment) => {
                        return (
                            <li key={comment.id}>
                                <CommentForm
                                    collection={collection}
                                    serverItem={serverItem}
                                    clientComment={clientComment}
                                />
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
}
