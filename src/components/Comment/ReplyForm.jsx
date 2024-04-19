import { useEffect, useState } from 'react';
import { timestamp } from '../../firebase/config';
import { useFirestore } from '../../hooks/useFirestore';
import spinner from '../../assets/spinner.svg';

export default function ReplyForm({
    serverUser,
    serverItem,
    comment,
    clientReply,
}) {
    const { updateDocument, loading } = useFirestore('MarketItem');
    const [addReplyLoading, setAddReplyLoading] = useState(true);
    const [isEdittingReply, setIsEdittingReply] = useState(false);
    const [editReplyContent, setEditReplyContent] = useState(
        clientReply?.content
    );

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

    const deleteReply = async (replyId) => {
        const commentIndex = serverItem.comments.findIndex(
            (c) => c.id === comment.id
        );

        if (commentIndex !== -1) {
            const commentToUpdate = serverItem.comments[commentIndex];

            if (commentToUpdate.childComment) {
                const replyIndex = commentToUpdate.childComment.findIndex(
                    (r) => r.id === replyId
                );
                if (replyIndex !== -1) {
                    commentToUpdate.childComment.splice(replyIndex, 1);

                    await updateDocument(
                        serverItem.id,
                        {
                            comments: [
                                ...serverItem.comments.slice(0, commentIndex),
                                commentToUpdate,
                                ...serverItem.comments.slice(commentIndex + 1),
                            ],
                        },
                        'MarketItem'
                    );
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
                createdAt: timestamp.fromDate(new Date()),
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
                    'MarketItem'
                );
            }
        }
    };

    return (
        <div>
            <label>{clientReply.displayName} </label>
            <div>{formatDate(clientReply.createdAt)}</div>

            {isEdittingReply ? (
                <textarea
                    value={editReplyContent || clientReply.content}
                    onChange={(e) => {
                        setEditReplyContent(e.target.value);
                    }}
                ></textarea>
            ) : (
                <div>
                    {addReplyLoading && <img src={spinner} />}
                    {clientReply.content}
                    {loading && <img src={spinner} />}
                </div>
            )}

            {serverUser && serverUser.id === clientReply.userId && (
                <div>
                    <button onClick={() => deleteReply(clientReply.id)}>
                        대댓 삭제
                    </button>

                    <button
                        onClick={() => {
                            if (isEdittingReply) {
                                setIsEdittingReply(!isEdittingReply);
                                editReply(clientReply.id);
                            } else {
                                setIsEdittingReply(!isEdittingReply);
                            }
                        }}
                    >
                        {isEdittingReply ? '수정 완료' : '대댓 수정'}
                    </button>
                </div>
            )}
        </div>
    );
}
