import { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuth';
import { useFirestore } from '../../hooks/useFirestore';
import { timestamp } from '../../firebase/config';
import ReplyForm from './ReplyForm';
import { useDocument } from '../../hooks/useDocument';
import spinner from '../../assets/spinner.svg';
import AddReplyForm from './AddReplyForm';

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
    const [clientReply, setClientReply] = useState([]);

    useEffect(() => {
        const matchedComment = serverItem?.comments?.find(comment => comment.id === clientComment.id);
        if (matchedComment) {
            setClientReply(matchedComment.childComment);
        }
    }, [
        clientComment?.id,
        serverItem?.comments
    ]);

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

    const deleteComment = async (id) => {
        const commentIndex = serverItem.comments.findIndex((c) => c.id === id);

        if (commentIndex !== -1) {
            const updatedComments = [
                ...serverItem.comments.slice(0, commentIndex),
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
            const updatedUserComments = originalUserInfo.userComment.filter(
                (comment) => comment.id !== id
            );
            originalUserInfo.userComment = updatedUserComments;
            await updateDocument(user.uid, originalUserInfo, 'User');
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
                createdAt: timestamp.fromDate(new Date()),
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
        }
    };

    const addReply = async (content) => {
        const commentIndex = serverItem.comments.findIndex(
            (c) => c.id === clientComment.id
        );

        if (commentIndex !== -1) {
            const commentToUpdate = serverItem.comments[commentIndex];

            // if (!commentToUpdate.childComment) {
            //     commentToUpdate.childComment = [];
            // }

            const reply = {
                displayName: userInfo.displayName,
                userId: userInfo.id,
                content: content,
                createdAt: timestamp.fromDate(new Date()),
                id: Math.random(),
            };
            setClientReply((prevState) => [...prevState, reply]);

            commentToUpdate.childComment.push(reply);

            await updateDocument(
                serverItem.id,
                {
                    comments: [
                        ...serverItem.comments.slice(0, commentIndex),
                        commentToUpdate,
                        ...serverItem.comments.slice(commentIndex + 1),
                    ],
                },
                collection
            );
        }
    };

    return (
        <div>
            <label>{clientComment.displayName} </label>
            <div>{formatDate(clientComment.createdAt)}</div>

            {isEditComment ? (
                <textarea
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                ></textarea>
            ) : (
                <div>
                    {addCommentLoading && <img src={spinner} />}
                    {clientComment.content}
                    {loading && <img src={spinner}/> }
                </div>
            )}

            {user && user.uid === clientComment.userId && (
                <div>
                    <button onClick={() => deleteComment(clientComment.id)}>
                        댓글 삭제
                    </button>
                    <button
                        onClick={() => {
                            if (isEditComment) {
                                editComment();
                                setIsEditComment(!isEditComment);
                            } else {
                                setIsEditComment(!isEditComment);
                            }
                        }}
                    >
                        {isEditComment ? '수정 완료' : '댓글 수정'}
                    </button>
                    <div>
                        <button onClick={() => setOpenReplys(!openReplys)}>
                            {openReplys
                                ? '대댓 닫기'
                                : '대댓 달기 + ' +
                                  `${clientComment.childComment.length}`}
                        </button>
                    </div>

                    {openReplys && (
                        <div>
                            <div>
                                {clientReply && clientReply.length > 0 &&
                                    clientReply.map((reply) => (
                                        <li key={reply.id}>
                                            <ReplyForm
                                                serverUser={userInfo}
                                                serverItem={serverItem}
                                                clientReply={reply}
                                                comment={clientComment}
                                            />
                                        </li>
                                        // <li key ={index}> Hello world</li>
                                    ))}
                            </div>

                            <AddReplyForm addReply={addReply} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
