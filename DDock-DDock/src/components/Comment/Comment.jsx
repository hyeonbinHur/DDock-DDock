import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuth';
import { useState } from 'react';
import { timestamp } from '../../firebase/config';

export default function Comment({ Item, collection }) {
    const { updateDocument, response } = useFirestore(collection);
    const { user } = useAuthContext();
    const [comment, setComment] = useState('');
    const [commentOnComment, setCommentOnComment] = useState({});
    const [reply2Comment, setReply2Comment] = useState({});
    const [currentEditComment, setCurrentEditComment] = useState(false);
    const [editReply, setEditReply] = useState(false);

    const openCommentArea = (id) => {
        setCommentOnComment((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

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
            console.log(commentToUpdate.childComment);

            await updateDocument(Item.id, {
                comments: [
                    ...Item.comments.slice(0, commentIndex),
                    commentToUpdate,
                    ...Item.comments.slice(commentIndex + 1),
                ],
            });
        }
    };

    const deleteComment = async (id) => {
        const commentIndex = Item.comments.findIndex((c) => c.id === id);

        if (commentIndex !== -1) {
            const updatedComments = [
                ...Item.comments.slice(0, commentIndex),
                ...Item.comments.slice(commentIndex + 1),
            ];

            await updateDocument(Item.id, {
                comments: updatedComments,
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

    const editComment = () => {
        setCurrentEditComment(!currentEditComment);
    };

    const editReply2Comment = () => {
        setEditReply(!editReply);
    };

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
                            <button onClick={() => openCommentArea(comment.id)}>
                                {commentOnComment[comment.id]
                                    ? '닫기'
                                    : '대댓 달기 + ' +
                                      `${comment.childComment.length}`}
                            </button>
                            {user && user.uid === comment.userId && (
                                <div>
                                    <button
                                        onClick={() =>
                                            deleteComment(comment.id)
                                        }
                                    >
                                        댓글 삭제
                                    </button>
                                    <button onClick={() => editComment()}>
                                        {' '}
                                        {currentEditComment
                                            ? '수정 완료'
                                            : '댓글 수정'}{' '}
                                    </button>
                                </div>
                            )}
                            {commentOnComment[comment.id] && (
                                <div>
                                    {comment.childComment.length > 0 &&
                                        comment.childComment.map((child) => (
                                            <ul key={child.id}>
                                                <label>
                                                    {child.displayName}{' '}
                                                </label>
                                                <div>
                                                    {formatDate(
                                                        child.createdAt
                                                    )}
                                                </div>
                                                <div>{child.content}</div>
                                                {user &&
                                                    user.uid ===
                                                        child.userId && (
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
                                                                onClick={() =>
                                                                    editReply2Comment()
                                                                }
                                                            >
                                                                {editReply
                                                                    ? '수정 완료'
                                                                    : '대댓 수정'}
                                                            </button>
                                                        </div>
                                                    )}
                                            </ul>
                                        ))}
                                    <form
                                        onSubmit={(event) =>
                                            addReply2Comment(comment.id, event)
                                        }
                                    >
                                        <p>one more comment here</p>
                                        <textarea
                                            onChange={(e) =>
                                                setReply2Comment((prev) => ({
                                                    ...prev,
                                                    [comment.id]:
                                                        e.target.value,
                                                }))
                                            }
                                            value={
                                                reply2Comment[comment.id] || ''
                                            }
                                        ></textarea>
                                        <button>submit</button>
                                    </form>
                                </div>
                            )}
                        </li>
                    ))}
            </ul>

            <form onSubmit={addComment}>
                <label>
                    <span>add new comment</span>
                    <textarea
                        onChange={() => setComment(event.target.value)}
                        value={comment}
                    ></textarea>
                </label>
                <button>submit</button>
            </form>
        </div>
    );
}
