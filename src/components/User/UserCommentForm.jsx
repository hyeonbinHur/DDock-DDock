import style from './UserCommentForm.module.css';
import { useDocument } from '../../hooks/useDocument';
import { Link } from 'react-router-dom';
import spinner from '../../assets/spinner.svg';
import { useFirestore } from '../../hooks/useFirestore';

export default function UserCommentForm({ comment, currentUser }) {

    const { updateDocument } = useFirestore('User');
    
    const { document, error, loading } = useDocument(
        'MarketItem',
        comment.itemId
    );

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
        const originalUserInfo = currentUser;
        const updatedUserComments = originalUserInfo.userComment.filter(
            (comment) => comment.id !== id
        );
        originalUserInfo.userComment = updatedUserComments;
        await updateDocument(currentUser.id, originalUserInfo, 'User');
    };

    return (
        <div className={style.parent}>
            {loading ? (
                <p>
                    <img src={spinner} alt="Loading" />
                </p>
            ) : document ? (
                <div>
                    <p className={style.parent}>{document.title}</p>
                    <p>{comment.displayName}</p>
                    <p>{formatDate(comment.createdAt)}</p>
                    <div>ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</div>
                    <div>{comment.content}</div>
                    <Link to={`/market/${comment.itemId}`}>Go to Item</Link>
                </div>
            ) : error == 'No such document exists' ? (
                <div>
                    <p> 아이템이 삭제가 되었어요 ㅠ</p>
                    <p>{comment.displayName}</p>
                    <p>{formatDate(comment.createdAt)}</p>
                    <div>ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</div>
                    <div>{comment.content}</div>
                    <button onClick={() => deleteComment(comment.id)}>x</button>
                </div>
            ) : (
                <p>인터넷 연결에 문제가 있어요 페이지를 다시 실행해주세요</p>
            )}
        </div>
    );
}
