import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuth';
import { useState } from 'react';
import { timestamp } from '../../firebase/config';
import CommentForm from './CommentFom';

export default function Comment({ Item, collection }) {
    const { updateDocument, response } = useFirestore(collection);
    const { user } = useAuthContext();

    const [comment, setComment] = useState('');

    const addComment = async (event) => {
        event.preventDefault();

        const addedComment = {
            displayName: user.displayName,
            userId: user.uid,
            content: comment,
            createdAt: timestamp.fromDate(new Date()),
            id: Math.random(),
            childComment: [],
        };

        await updateDocument(Item.id, {
            comments: [...Item.comments, addedComment],
        });

        if (!response.error) {
            setComment('');
        }
    };

    return (
        <div>
            <h4>ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</h4>
            <h4>Comments</h4>
            <ul>
                {Item.comments.length > 0 &&
                    Item.comments.map((comment) => {
                        return (<li key={comment.id}>
                            <CommentForm
                                collection={collection}
                                Item={Item}
                                comment={comment}
                            />
                        </li>);
                    })}
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
