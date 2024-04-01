import { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuth';
import { useFirestore } from '../../hooks/useFirestore';
import { timestamp } from '../../firebase/config';
import ReplyForm from './ReplyForm';
import { useDocument } from '../../hooks/useDocument';

export default function CommentForm({ collection, Item, comment }) {
    const [currentEditComment, setCurrentEditComment] = useState({});
    const [editingComment, setEdititngComment] = useState({});
    const [commentOnComment, setCommentOnComment] = useState({});
    const { user } = useAuthContext();
    const { updateDocument } = useFirestore(collection);
    const { document: userInfo } = useDocument('User', user.uid);

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
    const openCommentArea = (id) => {
        setCommentOnComment((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    const deleteComment = async (id) => {
        const commentIndex = Item.comments.findIndex((c) => c.id === id);

        if (commentIndex !== -1) {
            const updatedComments = [
                ...Item.comments.slice(0, commentIndex),
                ...Item.comments.slice(commentIndex + 1),
            ];

            await updateDocument(
                Item.id,
                {
                    comments: updatedComments,
                },
                collection
            );

            const originalUserInfo = userInfo;
            const updatedUserComments = originalUserInfo.userComment.filter(
                (comment) => comment.id !== id
            );
            originalUserInfo.userComment = updatedUserComments;
            console.log(originalUserInfo.userComment);
            await updateDocument(user.uid, originalUserInfo, 'User');
        }
    };

    const editCommentCheck = async (id) => {
        setCurrentEditComment((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));

        const commentIndex = Item.comments.findIndex((c) => c.id === id);
        if (commentIndex !== -1) {
            const originalComment = Item.comments[commentIndex];

            const editedComment = {
                ...originalComment,
                content: editingComment[id],
                createdAt: timestamp.fromDate(new Date()),
            };

            const updatedComments = [
                ...Item.comments.slice(0, commentIndex),
                editedComment,
                ...Item.comments.slice(commentIndex + 1),
            ];

            await updateDocument(
                Item.id,
                {
                    comments: updatedComments,
                },
                collection
            );
        }
    };

    return (
        <div>
            <label>{comment.displayName} </label>
            <div>{formatDate(comment.createdAt)}</div>
            {!currentEditComment[comment.id] && <div>{comment.content}</div>}

            {currentEditComment[comment.id] && (
                <textarea
                    value={editingComment[comment.id] || comment.content}
                    onChange={(e) =>
                        setEdititngComment((prev) => ({
                            ...prev,
                            [comment.id]: e.target.value,
                        }))
                    }
                ></textarea>
            )}
            <button onClick={() => openCommentArea(comment.id)}>
                {commentOnComment[comment.id]
                    ? '대댓 닫기'
                    : '대댓 달기 + ' + `${comment.childComment.length}`}
            </button>

            {user && user.uid === comment.userId && (
                <div>
                    <button onClick={() => deleteComment(comment.id)}>
                        댓글 삭제
                    </button>
                    <button
                        onClick={() => {
                            if (currentEditComment[comment.id]) {
                                editCommentCheck(comment.id);
                            } else {
                                setCurrentEditComment((prev) => ({
                                    ...prev,
                                    [comment.id]: true,
                                }));
                            }
                        }}
                    >
                        {currentEditComment[comment.id]
                            ? '수정 완료'
                            : '댓글 수정'}{' '}
                    </button>
                    {commentOnComment[comment.id] && (
                        <ReplyForm
                            collection={collection}
                            Item={Item}
                            comment={comment}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
