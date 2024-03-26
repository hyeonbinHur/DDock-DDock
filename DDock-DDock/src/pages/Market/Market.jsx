import MarketList from '../../components/MarketItem/MarketItemList';
import { useCollection } from '../../hooks/useCollection';
export default function MarketPage() {
    const { document, error, loading } = useCollection('MarketItem');

    function consolDoc() {
        console.log(document);
    }

    return (
        <div>
            <button onClick={consolDoc}>Console doc</button>
            <ul>
                {loading && <p> Loading... </p>}
                {!loading && document && <MarketList documents={document} />}
                {error && <p>{error}</p>}
            </ul>
        </div>
    );
}
