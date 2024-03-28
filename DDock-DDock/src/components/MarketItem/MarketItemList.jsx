import MarketItem from './MarketItem';
import ItemDeleteModal from '../Modal/ItemDeleteModal';
import { useRef } from 'react';
// import style from './MarketItemList.module.css';
import { Link } from 'react-router-dom';
export default function MarketList({ documents }) {
    const modal = useRef();
    function openConfirmModal() {
        modal.current.open();
    }
    return (
        <div>
            <Link to="/market/market-form">Add New Item</Link>
            <ul>
                {documents.map((doc) => (
                    <li key={doc.id}>
                        <MarketItem document={doc} />
                        <button onClick={openConfirmModal}>X</button>
                        <ItemDeleteModal ref={modal} id={doc.id} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
