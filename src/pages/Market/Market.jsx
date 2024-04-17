import MarketList from '../../components/MarketItem/MarketItemList';
import { useCollection } from '../../hooks/useCollection';
import { Link } from 'react-router-dom';

export default function MarketPage() {
    const { document, error, loading } = useCollection('MarketItem', ['createdAt', 'desc']);

    return (

        <div>
            {loading ? (
                <p>Loading...</p> // 로딩 중이면 로딩 메시지 표시
            ) : (
                <>
                 <Link to="/market/mupload">Add New Item</Link>
                    {error && <p>{error}</p>} 
                    <ul>
                        {document && <MarketList documents={document} />} 
                    </ul>
                </>
            )}
        </div>
    );
}