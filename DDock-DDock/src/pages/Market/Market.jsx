import MarketList from '../../components/MarketItem/MarketItemList';
import { useCollection } from '../../hooks/useCollection';
export default function MarketPage() {
    const { document, error } = useCollection('MarketItem');

    function consolDoc() {
        console.log(document);
    }

    return (
        <div>
            <button onClick={consolDoc}>Console doc</button>
            <ul>
                {error && <p>{error}</p>}
                {document && <MarketList documents={document} />}
            </ul>
        </div>
    );
}
