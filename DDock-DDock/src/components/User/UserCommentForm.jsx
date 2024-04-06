import style from './UserCommentForm.module.css';
import { useDocument } from '../../hooks/useDocument';
import { Link } from 'react-router-dom';

export default function UserCommentForm({ comment }) {
    const { document } = useDocument('MarketItem', comment.itemId);

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
        <div className={style.parent}>
            {document ? (
                <div>
                    <p className={style.parent}>{document.title}</p>
                    <p>{comment.displayName}</p>
                    <p>{formatDate(comment.createdAt)}</p>
                    <div>ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</div>
                    <div>{comment.content}</div>
                    <Link to={`/market/${comment.itemId}`}>
                        Go to Item
                    </Link>{' '}
                </div>
            ) : (
                <p> 물건이 삭제 됐네요...ㅠ</p>
            )}
        </div>
    );
}
