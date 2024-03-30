import { Link, useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import Comment from '../../components/Comment/Comment';
import { useAuthContext } from '../../hooks/useAuth';

export default function MarketItemDetail() {
    const { mitemId } = useParams();
    const { document, error } = useDocument('MarketItem', mitemId);
    const { user } = useAuthContext();

    if (error) {
        return <div className="error">{error}</div>;
    }
    if (!document) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <>
            <p>{document.title}</p>

            {user && user.uid === document.userId && (
                <Link to={`/market/${mitemId}/mupdate`}>Go to edit</Link>
            )}

            <Comment Item={document} collection="MarketItem" />
        </>
    );
}
