import { useEffect, useState, useRef } from 'react';
import { useAuthContext } from '../../hooks/useAuth';
import { useFirestore } from '../../hooks/useFirestore';
import { timestamp } from '../../firebase/config';
import ReplyForm from './ReplyForm';
import { useDocument } from '../../hooks/useDocument';
import spinner2 from '../../assets/logo/spinner2.svg';
import AddReplyForm from './AddReplyForm';
import { useDispatch } from 'react-redux';
import {
    deleteCommentOnItem,
    updateCommentOnItem,
    addReplyOnItem,
} from '../../store/ItemSlice';
import { getSydneyTimeISO } from '../../util/formDate';
import {
    addCommentOnCollection,
    deleteCommentOnCollection,
} from '../../store/marketCollectionSlice';

import {
    addCommentOnJCollection,
    deleteCommentOnJCollection,
} from '../../store/jobCollectionSlice';

import {
    addCommentOnCCollection,
    deleteCommentOnCCollection,
} from '../../store/communityCollectionSlice';

import {
    addCommentOnHCollection,
    deleteCommentOnHCollection,
} from '../../store/houseCollectionSilce';

import { calculateTime } from '../../util/formDate';

// import spinner from '../../assets/spinner.svg'

export default function CommentForm({ collection, serverItem, clientComment }) {
    const { user } = useAuthContext();
    const { updateDocument, loading } = useFirestore(collection);
    const { document: userInfo } = useDocument('User', user.uid);

    const [addCommentLoading, setAddCommentLoading] = useState(true);
    const [openReplys, setOpenReplys] = useState(false);
    const [editCommentContent, setEditCommentContent] = useState(
        clientComment?.content
    );

    const [isEditComment, setIsEditComment] = useState(false);

    const dispatch = useDispatch();

    const { result: timeDif, unit: timeString } = calculateTime(
        clientComment?.createdAt
    );

    const textarearRef = useRef(null);

    useEffect(() => {
        if (editCommentContent && isEditComment) {
            textarearRef.current.style.height = 'auto';
            textarearRef.current.style.height =
                textarearRef.current.scrollHeight + 'px';
        }
    }, [editCommentContent, isEditComment]);

    // useEffect(() => {
    //     const matchedComment = serverItem?.comments?.find(comment => comment.id === clientComment.id);
    //     if (matchedComment) {
    //         setClientReply(matchedComment.childComment);
    //     }
    // }, [
    //     clientComment?.id,
    //     serverItem?.comments
    // ]);

    useEffect(() => {
        if (serverItem?.comments) {
            const serverComments = serverItem.comments;
            if (
                serverComments.some(
                    (serverComment) => serverComment.id == clientComment.id
                )
            ) {
                setAddCommentLoading(false);
            }
        }
    }, [clientComment?.id, serverItem?.comments]);

    const deleteComment = async (id) => {
        const commentIndex = serverItem.comments.findIndex((c) => c.id === id);
        if (commentIndex !== -1) {
            const updatedComments = [
                ...serverItem.comments.slice(0, commentIndex),
                ...serverItem.comments.slice(commentIndex + 1),
            ];
            const newNumOfComment = serverItem.numOfComment - 1;

            await updateDocument(
                serverItem.id,
                {
                    comments: updatedComments,
                    numOfComment: newNumOfComment,
                },
                collection
            );

            const originalUserInfo = userInfo;
            const updatedUserComments = originalUserInfo.userComment.filter(
                (comment) => comment.id !== id
            );
            originalUserInfo.userComment = updatedUserComments;
            await updateDocument(user.uid, originalUserInfo, 'User');

            dispatch(deleteCommentOnItem({ id: id }));
            const num = serverItem.comments[commentIndex].childComment.length;

            if (collection == 'MarketItem') {
                dispatch(
                    deleteCommentOnCollection({
                        itemId: serverItem.id,
                        numOfReply: num + 1,
                    })
                );
            } else if (collection == 'JobItem') {
                dispatch(
                    deleteCommentOnJCollection({
                        item: serverItem,
                        numOfReply: num + 1,
                    })
                );
            } else if (collection == 'HouseItem') {
                dispatch(
                    deleteCommentOnHCollection({
                        item: serverItem,
                        numOfReply: num + 1,
                    })
                );
            } else if (collection == 'CommunityItem') {
                dispatch(
                    deleteCommentOnCCollection({
                        item: serverItem,
                        numOfReply: num + 1,
                    })
                );
            }
        }
    };

    const editComment = async () => {
        const commentIndex = serverItem.comments.findIndex(
            (c) => c.id === clientComment.id
        );
        if (commentIndex !== -1) {
            const originalComment = serverItem.comments[commentIndex];

            const editedComment = {
                ...originalComment,
                content: editCommentContent,
                createdAt: getSydneyTimeISO(timestamp.fromDate(new Date())),
            };

            const updatedComments = [
                ...serverItem.comments.slice(0, commentIndex),
                editedComment,
                ...serverItem.comments.slice(commentIndex + 1),
            ];

            await updateDocument(
                serverItem.id,
                {
                    comments: updatedComments,
                },
                collection
            );

            const originalUserInfo = userInfo;
            const updatedUserComments = originalUserInfo.userComment.map(
                (comment) => {
                    if (comment.id === clientComment.id) {
                        return editedComment;
                    }
                    return comment;
                }
            );
            originalUserInfo.userComment = updatedUserComments;
            await updateDocument(user.uid, originalUserInfo, 'User');

            dispatch(updateCommentOnItem({ comment: editedComment }));
        }
    };

    const addReply = async (content) => {
        const commentIndex = serverItem.comments.findIndex(
            (c) => c.id === clientComment.id
        );

        if (commentIndex !== -1) {
            const commentToUpdate = { ...serverItem.comments[commentIndex] };
            const reply = {
                displayName: userInfo.displayName,
                userId: userInfo.id,
                content: content,
                createdAt: getSydneyTimeISO(timestamp.fromDate(new Date())),
                id: Math.random(),
            };

            commentToUpdate.childComment = commentToUpdate.childComment
                ? [...commentToUpdate.childComment, reply]
                : [reply];

            const updatedComments = [
                ...serverItem.comments.slice(0, commentIndex),
                commentToUpdate,
                ...serverItem.comments.slice(commentIndex + 1),
            ];
            const newNumOfComment = serverItem.numOfComment + 1;

            await updateDocument(
                serverItem.id,
                { comments: updatedComments, numOfComment: newNumOfComment },
                collection
            );

            dispatch(
                addReplyOnItem({ reply: reply, commentId: clientComment.id })
            );
            if (collection == 'MarketItem') {
                dispatch(addCommentOnCollection({ itemId: serverItem.id }));
            } else if (collection == 'JobItem') {
                dispatch(addCommentOnJCollection({ item: serverItem }));
            } else if (collection == 'HouseItem') {
                dispatch(addCommentOnHCollection({ item: serverItem }));
            } else if (collection == 'CommunityItem') {
                dispatch(addCommentOnCCollection({ item: serverItem }));
            }
        }
    };

    return (
        <div className="p-3  rounded-lg bg-stone-200">
            <div className="flex justify-between p-1 ">
                <label className="text-sm">{clientComment.displayName} </label>
                <div className="text-sm flex">
                    {addCommentLoading ||
                        (loading && <img src={spinner2} className="size-20" />)}
                    {!addCommentLoading && (
                        <div className="flex">
                            {timeDif} {timeString}
                        </div>
                    )}
                </div>
            </div>

            {isEditComment ? (
                <textarea
                    className="outline-none focus:outline-none active:outline-none overflow-hidden underline-offset-4 w-full bg-stone-100 rounded-lg p-2"
                    value={editCommentContent}
                    ref={textarearRef}
                    rows="2"
                    onChange={(e) => setEditCommentContent(e.target.value)}
                ></textarea>
            ) : (
                <div className="rounded-md p-2 bg-stone-100 shadow-sm">
                    {clientComment.content}
                </div>
            )}

            {user && user.uid === clientComment.userId && (
                <div>
                    <div className="flex space-x-5 text-xs mt-2">
                        <div
                            onClick={() => deleteComment(clientComment.id)}
                            className="border border-red-300 bg-red-100 rounded p-1 hover:scale-105 hover:text-red-600"
                        >
                            Delete
                        </div>

                        <button
                            className="border border-sky-200 bg-sky-200 p-1 rounded hover:scale-105 hover:text-blue-700 "
                            onClick={() => {
                                if (isEditComment) {
                                    editComment();
                                    setIsEditComment(!isEditComment);
                                } else {
                                    setIsEditComment(!isEditComment);
                                }
                            }}
                        >
                            {isEditComment ? 'Confirm' : 'Modify'}
                        </button>
                    </div>

                    <div className="text-sm p-1">
                        <button
                            className="p-0.5  text-blue-700"
                            onClick={() => setOpenReplys(!openReplys)}
                        >
                            {openReplys
                                ? 'close reply'
                                : 'reply + ' +
                                  `${clientComment.childComment.length}`}
                        </button>
                    </div>

                    {openReplys && (
                        <div className="p-2 text-base">
                            <AddReplyForm addReply={addReply} />

                            <div>
                                {clientComment.childComment &&
                                    clientComment.childComment.length > 0 &&
                                    clientComment.childComment.map((reply) => (
                                        <ul key={reply.id}>
                                            <ReplyForm
                                                serverUser={userInfo}
                                                serverItem={serverItem}
                                                clientReply={reply}
                                                comment={clientComment}
                                                collection={collection}
                                            />
                                        </ul>
                                        // <li key ={index}> Hello world</li>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
//
