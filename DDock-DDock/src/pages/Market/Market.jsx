import MarketList from '../../components/MarketItem/MarketItemList';
import { useCollection } from '../../hooks/useCollection';

export default function MarketPage() {
    
    const { document, error, loading } = useCollection('MarketItem');

    return (
        <div>
            {loading ? (
                <p>Loading...</p> // 로딩 중이면 로딩 메시지 표시
            ) : (
                <>
                    {error && <p>{error}</p>} 
                    <ul>
                        {document && <MarketList documents={document} />} 
                    </ul>
                </>
            )}
        </div>
    );
}