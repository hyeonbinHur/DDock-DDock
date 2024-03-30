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

        // 댓글 배열에서 ID가 일치하는 댓글을 찾습니다.
        const commentIndex = Item.comments.findIndex((c) => c.id === commentId);
        if (commentIndex !== -1) {
            // 해당 댓글이 존재하면, childComment 배열에 대댓글을 추가합니다.
            const commentToUpdate = Item.comments[commentIndex];
            if (!commentToUpdate.childComment) {
                commentToUpdate.childComment = []; // childComment 배열이 없으면 초기화합니다.
            }
            const added2Comment = {
                displayName: user.displayName,
                content: reply2Comment[commentId],
                createdAt: timestamp.fromDate(new Date()),
                id: Math.random(),
            };

            commentToUpdate.childComment.push(added2Comment);

            // 여기서 Item 객체를 업데이트하는 로직을 추가합니다.
            // 예: 데이터베이스에 Item을 업데이트하는 함수를 호출
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
                            {commentOnComment[comment.id] ? '닫기' : '대댓 달기 + ' + `${comment.childComment.length}`}
                            </button>
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
