import { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuth';
import { timestamp } from '../../firebase/config';
import { useFirestore } from '../../hooks/useFirestore';
export default function ReplyForm({ collection, Item, comment }) {
    const { user } = useAuthContext();
    const [reply2Comment, setReply2Comment] = useState({});
    const { updateDocument } = useFirestore(collection);
    const [startEditReply, setStartEditReply] = useState({});
    const [editReply, setEditReply] = useState({});

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
    const addReply2Comment = async (comment_id, event) => {
        event.preventDefault();

        const commentIndex = Item.comments.findIndex(
            (c) => c.id === comment_id
        );
        if (commentIndex !== -1) {
            const commentToUpdate = Item.comments[commentIndex];

            if (!commentToUpdate.childComment) {
                commentToUpdate.childComment = [];
            }
            const added2Comment = {
                displayName: user.displayName,
                userId: user.uid,
                content: reply2Comment[comment_id],
                createdAt: timestamp.fromDate(new Date()),
                id: Math.random(),
            };

            commentToUpdate.childComment.push(added2Comment);

            await updateDocument(Item.id, {
                comments: [
                    ...Item.comments.slice(0, commentIndex),
                    commentToUpdate,
                    ...Item.comments.slice(commentIndex + 1),
                ],
            });
        }
    };

    const deleteReply2Comment = async (comment_id, replyId) => {
        const commentIndex = Item.comments.findIndex(
            (c) => c.id === comment_id
        );

        if (commentIndex !== -1) {
            const commentToUpdate = Item.comments[commentIndex];

            if (commentToUpdate.childComment) {
                const replyIndex = commentToUpdate.childComment.findIndex(
                    (r) => r.id === replyId
                );
                if (replyIndex !== -1) {
                    commentToUpdate.childComment.splice(replyIndex, 1);

                    await updateDocument(Item.id, {
                        comments: [
                            ...Item.comments.slice(0, commentIndex),
                            commentToUpdate,
                            ...Item.comments.slice(commentIndex + 1),
                        ],
                    });
                }
            }
        }
    };

    const editReply2Comment = async (comment, reply_id) => {
        const replyIndex = comment.findIndex((c) => c.id === reply_id);
        if (replyIndex !== -1) {
            const originalReply = comment[replyIndex];
            const editedReply = {
                ...originalReply,
                content: editReply[reply_id],
                createdAt: timestamp.fromDate(new Date()),
            };

            const updatedReply = {
                ...comment.slice(0, replyIndex),
                editedReply,
                ...comment.slice(replyIndex + 1),
            };

            const comment_index = Item.comments.findIndex(
                (c) => c.id === comment.id
            );
            if (comment_index !== -1) {
                const originalComment = Item.comments[comment_index];
                const edittedComment = {
                    ...originalComment,
                    childComment: updatedReply,
                };

                const updatedComments = [
                    ...Item.comments.slice(0, comment_index),
                    edittedComment,
                    ...Item.comments.slice(comment_index + 1),
                ];

                await updateDocument(Item.id, {
                    comments: updatedComments,
                });
            }
        }

        setStartEditReply((prev) => ({
            ...prev,
            [reply_id]: false,
        }));
    };

    return (
        <div>
            {comment.childComment.length > 0 &&
                comment.childComment.map((child) => (
                    <ul key={child.id}>
                        <label>{child.displayName} </label>
                        <div>{formatDate(child.createdAt)}</div>

                        {/*  */}
                        {!startEditReply[child.id] && (
                            <div>{child.content}</div>
                        )}
                        {startEditReply[child.id] && (
                            <textarea
                                value={editReply[child.id] || child.content}
                                onChange={(e) => {
                                    setEditReply((prev) => ({
                                        ...prev,
                                        [child.id]: e.target.value,
                                    }));
                                }}
                            ></textarea>
                        )}

                        {/*  */}
                        {user && user.uid === child.userId && (
                            <div>
                                <button
                                    onClick={() =>
                                        deleteReply2Comment(
                                            comment.id,
                                            child.id
                                        )
                                    }
                                >
                                    대댓 삭제
                                </button>

                                <button
                                    onClick={() => {
                                        if (!editReply) {
                                            setStartEditReply((prev) => ({
                                                ...prev,
                                                [child.id]: true,
                                            }));
                                        } else {
                                            editReply2Comment(
                                                comment.id,
                                                child.id
                                            );
                                        }
                                    }}
                                >
                                    {startEditReply[child.id]
                                        ? '수정 완료'
                                        : '대댓 수정'}
                                </button>
                            </div>
                        )}
                    </ul>
                ))}

            <form onSubmit={(event) => addReply2Comment(comment.id, event)}>
                <p>one more comment here</p>
                <textarea
                    onChange={(e) =>
                        setReply2Comment((prev) => ({
                            ...prev,
                            [comment.id]: e.target.value,
                        }))
                    }
                    value={reply2Comment[comment.id] || ''}
                ></textarea>

                <button>submit</button>
            </form>
        </div>
    );
}
