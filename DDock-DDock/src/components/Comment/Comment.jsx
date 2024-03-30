import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuth';
import { useState } from 'react';
import { timestamp } from '../../firebase/config';

export default function Comment({ Item, collection }) {
    const { updateDocument, response } = useFirestore(collection);
    const { user } = useAuthContext();
    const [comment, setComment] = useState('');

    const addComment = async (event) => {
        event.preventDefault();
        console.log(user.displayName);
        const addedComment = {
            displayName: user.displayName,
            content: comment,
            createdAt: timestamp.fromDate(new Date()),
            id: Math.random(),
        };

        await updateDocument(Item.id, {
            comments: [...Item.comments, addedComment],
        });
        if (!response.error) {
            setComment('');
        }
    };

    function formatDate(timestamp) {
        return new Date(timestamp.seconds * 1000).toLocaleString('en-AU', {
            timeZone: 'Australia/Sydney',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    }

    return (
        <div>
            <h4>ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</h4>
            <h4>Comments</h4>
            <ul>
                {Item.comments.length > 0 &&
                    Item.comments.map((comment) => (
                        <li key={comment.id}>
                            <label>{comment.displayName} </label>
                            <div>{formatDate(comment.createdAt)}</div>
                            <div>{comment.content}</div>
                        </li>
                    ))}
            </ul>

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
        </div>
    );
}
