import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { timestamp } from '../../firebase/config';
import CommentForm from './CommentFom';
import { useDocument } from '../../hooks/useDocument';
import { useDispatch } from 'react-redux';
import {addCommentOnItem} from '../../store/ItemSlice'
import { addCommentOnCollection } from '../../store/marketCollectionSlice';
import { getSydneyTimeISO } from '../../util/formDate';

export default function Comment({ serverItem, collection }) {
    const { updateDocument, response } = useFirestore(collection);
    const { user } = useAuthContext();
    const { updateDocument: updateUser } = useFirestore('User');
    const { document: userInfo } = useDocument('User', user.uid);
    const [comment, setComment] = useState('');
    const [clientComments, setClientComments] = useState([]);
    const dispatch = useDispatch();

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
            createdAt: getSydneyTimeISO(timestamp.fromDate(new Date())),
            id: Math.random(),
            childComment: [],
            serverItemId: serverItem.id,
        };
        
        setClientComments((prevState) => [...prevState, addedComment]);
        const newNumOfComment = serverItem.numOfComment+1;
        await updateDocument(
            serverItem.id,
            {
                comments: [...serverItem.comments, addedComment],
                numOfComment: newNumOfComment
            },
            collection
        );

        dispatch(addCommentOnItem({comment: addedComment}))
        dispatch(addCommentOnCollection({itemId:serverItem.id }))


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
                            <li key={clientComment.id}>
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
