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
    const addReply2Comment = async (commentId, event) => {
        event.preventDefault();

        const commentIndex = Item.comments.findIndex((c) => c.id === commentId);
        if (commentIndex !== -1) {
            const commentToUpdate = Item.comments[commentIndex];
            if (!commentToUpdate.childComment) {
                commentToUpdate.childComment = [];
            }
            const added2Comment = {
                displayName: user.displayName,
                userId: user.uid,
                content: reply2Comment[commentId],
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

    const deleteReply2Comment = async (commentId, replyId) => {
        const commentIndex = Item.comments.findIndex((c) => c.id === commentId);

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

    const editReply2Comment = (id) => {
        setStartEditReply((prev) => ({
            ...prev,
            [id]: !prev[id],
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
                        {!startEditReply[child.id] && <div>{child.content}</div>}
                        {startEditReply[child.id] && <textarea>Hello</textarea>}

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
                                    onClick={() => editReply2Comment(child.id)}
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
