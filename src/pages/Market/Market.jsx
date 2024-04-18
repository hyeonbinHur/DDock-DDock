import MarketList from '../../components/MarketItem/MarketItemList';
import { useCollection } from '../../hooks/useCollection';
import { Link } from 'react-router-dom';
import spinner from '../../assets/spinner.svg';

export default function MarketPage() {
    const { document, error, loading } = useCollection('MarketItem', [
        'createdAt',
        'desc',
    ]);

    return (
        <div>
            {error ? (
                <p>error</p>
            ) : loading ? (
                <img src={spinner}/>
            ) : (
                <>
                    <Link to="/market/mupload">Add New Item</Link>
                    {error && <p>{error}</p>}
                    <ul>{document && <MarketList documents={document} />}</ul>
                </>
            )}
        </div>
    );
}
