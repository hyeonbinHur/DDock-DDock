import { useEffect, useState, useRef } from 'react';
import { timestamp } from '../../firebase/config';
import { useFirestore } from '../../hooks/useFirestore';
import { useDispatch } from 'react-redux';
import { delteReplyOnItem, updateReplyOnItem } from '../../store/ItemSlice';
import { getSydneyTimeISO } from '../../util/formDate';
// import { deleteComment } from '../../store/marketCollectionSlice';
import { deleteCommentOnCollection } from '../../store/marketCollectionSlice';
import { deleteCommentOnJCollection } from '../../store/jobCollectionSlice';
import { deleteCommentOnHCollection } from '../../store/houseCollectionSilce';
import { deleteCommentOnCCollection } from '../../store/communityCollectionSlice';

import { calculateTime } from '../../util/formDate';
import spinner2 from '../../assets/logo/spinner2.svg';

export default function ReplyForm({
    serverUser,
    serverItem,
    comment,
    clientReply,
    collection,
}) {
    const { updateDocument, loading } = useFirestore('MarketItem');
    const [addReplyLoading, setAddReplyLoading] = useState(true);
    const [isEdittingReply, setIsEdittingReply] = useState(false);
    const [editReplyContent, setEditReplyContent] = useState(
        clientReply?.content
    );
    const dispatch = useDispatch();
    const { result: timeDif, unit: timeString } = calculateTime(
        clientReply?.createdAt
    );
    const replyRef = useRef(null);

    useEffect(() => {
        if (isEdittingReply) {
            replyRef.current.style.height = 'auto';
            replyRef.current.style.height =
                replyRef.current.scrollHeight + 'px';
        }
    }, [editReplyContent, isEdittingReply]);

    useEffect(() => {
        const targetComment = serverItem?.comments?.find(
            (c) => c.id === comment.id
        );
        const targetReply = targetComment?.childComment.find(
            (r) => r.id === clientReply.id
        );

        if (targetReply) {
            setAddReplyLoading(false);
        }
    }, [clientReply?.id, comment.id, serverItem?.comments]);

    const deleteReply = async (replyId) => {
        const commentIndex = serverItem.comments.findIndex(
            (c) => c.id === comment.id
        );
        if (commentIndex !== -1) {
            const commentToUpdate = { ...serverItem.comments[commentIndex] };
            if (commentToUpdate.childComment) {
                const replyIndex = commentToUpdate.childComment.findIndex(
                    (r) => r.id === replyId
                );

                if (replyIndex !== -1) {
                    // 불변성을 유지하면서 배열에서 답글 제거
                    const updatedChildComments = [
                        ...commentToUpdate.childComment.slice(0, replyIndex),
                        ...commentToUpdate.childComment.slice(replyIndex + 1),
                    ];
                    // 업데이트할 댓글 객체에 새로운 답글 배열 할당

                    const updatedComment = {
                        ...commentToUpdate,
                        childComment: updatedChildComments,
                    };
                    // 전체 댓글 배열 업데이트
                    const updatedComments = [
                        ...serverItem.comments.slice(0, commentIndex),
                        updatedComment,
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

                    dispatch(
                        delteReplyOnItem({
                            replyId: replyId,
                            commentId: comment.id,
                        })
                    );

                    if (collection == 'MarketItem') {
                        dispatch(
                            deleteCommentOnCollection({
                                itemId: serverItem.id,
                                num: 1,
                            })
                        );
                    } else if (collection == 'JobItem') {
                        dispatch(
                            deleteCommentOnJCollection({
                                item: serverItem,
                                numOfReply: 1,
                            })
                        );
                    } else if (collection == 'HouseItem') {
                        dispatch(
                            deleteCommentOnHCollection({
                                item: serverItem,
                                numOfReply: 1,
                            })
                        );
                    } else if (collection == 'CommunityItem') {
                        dispatch(
                            deleteCommentOnCCollection({
                                item: serverItem,
                                numOfReply: 1,
                            })
                        );
                    }
                }
            }
        }
    };

    const editReply = async (reply_id) => {
        const replyIndex = comment.childComment.findIndex(
            (c) => c.id === reply_id
        );
        if (replyIndex !== -1) {
            const originalReply = comment.childComment[replyIndex];

            const editedReply = {
                ...originalReply,
                content: editReplyContent,
                createdAt: getSydneyTimeISO(timestamp.fromDate(new Date())),
            };

            const updatedReply = [
                ...comment.childComment.slice(0, replyIndex),
                editedReply,
                ...comment.childComment.slice(replyIndex + 1),
            ];

            const comment_index = serverItem.comments.findIndex(
                (c) => c.id === comment.id
            );

            if (comment_index !== -1) {
                const originalComment = serverItem.comments[comment_index];
                const edittedComment = {
                    ...originalComment,
                    childComment: updatedReply,
                };

                const updatedComments = [
                    ...serverItem.comments.slice(0, comment_index),
                    edittedComment,
                    ...serverItem.comments.slice(comment_index + 1),
                ];

                await updateDocument(
                    serverItem.id,
                    {
                        comments: updatedComments,
                    },
                    collection
                );

                dispatch(
                    updateReplyOnItem({
                        reply: editedReply,
                        commentId: comment.id,
                    })
                );
            }
        }
    };
    const cancelEdit = () => {
        setEditReplyContent(clientReply?.content);
        setIsEdittingReply(!isEdittingReply);
    };

    return (
        <div className="bg-stone-300 border-stone-500 shadow-inner mt-3 rounded-md p-2">
            <div className="flex justify-between text-sm pl-1">
                <label>{clientReply.displayName} </label>
                <div className="flex">
                    {!addReplyLoading ||
                        (loading && (
                            <img
                                src={spinner2}
                                className="bg-transparent size-20"
                            />
                        ))}

                    {addReplyLoading && (
                        <div className="flex">
                            {' '}
                            {timeDif} {timeString}{' '}
                        </div>
                    )}
                </div>
            </div>

            {isEdittingReply ? (
                <textarea
                    className="w-full rounded-md outline-none active:outline-none focus:outline-none p-1 px-2 bg-white"
                    value={editReplyContent || clientReply.content}
                    onChange={(e) => {
                        setEditReplyContent(e.target.value);
                    }}
                    ref={replyRef}
                    rows={1}
                ></textarea>
            ) : (
                <div className="p-2 bg-neutral-100 rounded-md">
                    {clientReply.content}
                </div>
            )}

            {serverUser && serverUser.id === clientReply.userId && (
                <div className="text-xs space-x-3">
                    <button
                        onClick={() => deleteReply(clientReply.id)}
                        className="border border-red-300 bg-red-100 rounded p-1 hover:scale-105 hover:text-red-600"
                    >
                        Delete
                    </button>
                    {editReplyContent != ' ' && (
                        <button
                            className="border mt-2 border-sky-200 bg-sky-200 p-1 rounded hover:scale-105 hover:text-blue-700"
                            onClick={() => {
                                if (isEdittingReply) {
                                    setIsEdittingReply(!isEdittingReply);
                                    editReply(clientReply.id);
                                } else {
                                    setIsEdittingReply(!isEdittingReply);
                                }
                            }}
                        >
                            {isEdittingReply ? 'Confirm' : 'Modify'}
                        </button>
                    )}
                    {isEdittingReply && (
                        <button
                            type="button"
                            onClick={() => cancelEdit()}
                            className="border border-gray-300 bg-gray-100 rounded p-1 hover:scale-105 hover:text-gray-600"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
