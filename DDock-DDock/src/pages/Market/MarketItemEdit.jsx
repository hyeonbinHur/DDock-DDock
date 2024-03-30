import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
export default function MarketItemEdit() {
    const { mitemId } = useParams();
    const { document, error } = useDocument('MarketItem', mitemId);

    if (error) {
        return <div className="error">{error}</div>;
    }
    if (!document) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <>
            <p>{document.title}</p>
            <p>Hello edit</p>
        </>
    );
}
