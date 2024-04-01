import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuth';
import { useState } from 'react';
import { timestamp } from '../../firebase/config';
import CommentForm from './CommentFom';
import { useDocument } from '../../hooks/useDocument';

export default function Comment({ Item, collection }) {
    const { updateDocument, response } = useFirestore(collection);
    const { user } = useAuthContext();
    const { updateDocument: updateUser } = useFirestore('User');
    const { document: userInfo } = useDocument('User', user.uid);

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

        await updateDocument(
            Item.id,
            {
                comments: [...Item.comments, addedComment],
            },
            collection
        );

        if (user) {
            const originalUser = userInfo;
            const originalUserComment = originalUser.userComment;
            const updatedUserComment = [...originalUserComment, addedComment];
            originalUser.userComment = updatedUserComment;
            await updateUser(user.uid, originalUser, 'User');
        }

        if (!response.error) {
            setComment('');
        }
    };

    function HelloWorld(){
        console.log(userInfo.userComment);
    }

    return (
        <div>
            <button onClick={HelloWorld}>Check user</button>
            <h4>ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</h4>
            <h4>Comments</h4>
            <ul>
                {Item.comments.length > 0 &&
                    Item.comments.map((comment) => {
                        return (
                            <li key={comment.id}>
                                <CommentForm
                                    collection={collection}
                                    Item={Item}
                                    comment={comment}
                                />
                            </li>
                        );
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
