import MarketItem from './MarketItem';
// import style from './MarketItemList.module.css';
import { Link } from 'react-router-dom';
export default function MarketList({ documents }) {
    
    return (
        <div>
            <Link to="/market/market-form">Add New Item</Link>
            <ul>
                {documents.map((doc) => (
                    <li key={doc.id}>
                        <MarketItem document={doc} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
