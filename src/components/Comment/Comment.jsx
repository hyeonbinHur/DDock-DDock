import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuth';
import { useEffect, useState, useRef } from 'react';
import { timestamp } from '../../firebase/config';
import CommentForm from './CommentFom';
import { useDocument } from '../../hooks/useDocument';
import { useDispatch } from 'react-redux';
import { addCommentOnItem } from '../../store/ItemSlice';
import { addCommentOnCollection } from '../../store/marketCollectionSlice';
import { getSydneyTimeISO } from '../../util/formDate';
import { addCommentOnJCollection } from '../../store/jobCollectionSlice';
import { addCommentOnHCollection } from '../../store/houseCollectionSilce';
import { addCommentOnCCollection } from '../../store/communityCollectionSlice';

export default function Comment({ serverItem, collection }) {
    const { updateDocument, response } = useFirestore(collection);
    const { user } = useAuthContext();
    const { updateDocument: updateUser } = useFirestore('User');
    const { document: userInfo } = useDocument('User', user.uid);
    const [comment, setComment] = useState('');
    const [clientComments, setClientComments] = useState([]);
    const dispatch = useDispatch();
    const textarearRef = useRef(null);

    useEffect(() => {
        textarearRef.current.style.height = 'auto';
        textarearRef.current.style.height =
            textarearRef.current.scrollHeight + 'px';
    }, [comment]);

    useEffect(() => {
        setClientComments(serverItem.comments);
    }, [serverItem.comments]);

    const addComment = async (event) => {
        event.preventDefault();

        if (comment == '') {
            textarearRef.focus();
            return;
        }
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
        const newNumOfComment = serverItem.numOfComment + 1;
        await updateDocument(
            serverItem.id,
            {
                comments: [...serverItem.comments, addedComment],
                numOfComment: newNumOfComment,
            },
            collection
        );

        dispatch(addCommentOnItem({ comment: addedComment }));

        if (collection == 'MarketItem') {
            dispatch(addCommentOnCollection({ itemId: serverItem.id }));
        } else if (collection == 'JobItem') {
            dispatch(addCommentOnJCollection({ item: serverItem }));
        } else if (collection == 'HouseItem') {
            dispatch(addCommentOnHCollection({ item: serverItem }));
        } else if (collection == 'CommunityItem') {
            dispatch(addCommentOnCCollection({ item: serverItem }));
        }

        const originalUser = userInfo;
        const originalUserComment = originalUser.userComment;
        const updatedUserComment = [...originalUserComment, addedComment];
        originalUser.userComment = updatedUserComment;

        await updateUser(user.uid, originalUser, 'User');
    };

    return response.error ? (
        <p>error</p>
    ) : (
        <div className="space-y-3 bg-stone-50 p-1 rounded-lg">
            <h4 className="font-bold text-xl text-center">
                {serverItem.numOfComment} comments
            </h4>
            <form onSubmit={addComment}>
                <div className="max-h-screen w-full ">
                    <textarea
                        className="outline-none focus:outline-none active:outline-none  underline-offset-4 w-full bg-stone-100 rounded-lg p-2"
                        onChange={(event) => setComment(event.target.value)}
                        value={comment}
                        ref={textarearRef}
                        rows="2"
                        placeholder="add comment..."
                    ></textarea>
                </div>
                {comment.length > 0 && (
                    <div className="flex items-end justify-end space-x-3">
                        <div
                            className="border rounded-lg p-1 hover:scale-105 bg-gray-50"
                            onClick={() => setComment('')}
                        >
                            cancel
                        </div>
                        <button className="border rounded-lg p-1 hover:scale-105 bg-gray-200">
                            submit
                        </button>
                    </div>
                )}
            </form>
            <ul className="space-y-3">
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
