import MarketList from '../../components/MarketItem/MarketItemList';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function MarketPage() {
    const {user} = useAuthContext()
    const { document, error, loading } = useCollection('MarketItem', ['createdAt', 'desc']);
    function asd(){
        console.log(user.email);
    }
    return (
        <div>
            <button onClick={asd}>Display name</button>
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