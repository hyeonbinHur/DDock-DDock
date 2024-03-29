import MarketItem from './MarketItem';
import ItemDeleteModal from '../Modal/ItemDeleteModal';
import { useRef, useState } from 'react';
// import style from './MarketItemList.module.css';
import { Link, useNavigate } from 'react-router-dom';
export default function MarketList({ documents }) {
    const [deleteItemId, setDeleteItemId] = useState(null);
    const modal = useRef();
    const navigate = useNavigate();

    function handleUpdate(itemId, itemData) {
        navigate(`/market/market-form/${itemId}`, { state: { item: itemData } });
    }

    function openConfirmModal(itemId) {
        setDeleteItemId(itemId);
        modal.current.open();
    }

    return (
        <div>
            <Link to="/market/mupload">Add New Item</Link>
            <ul>
                {documents.map((doc) => (
                    <li key={doc.id}>
                        <MarketItem document={doc} />
                        <button onClick={() => openConfirmModal(doc.id)}>
                            X
                        </button>
                        <button onClick={() => handleUpdate(doc.id, doc)}>Update</button>
                    </li>
                ))}
            </ul>
            <ItemDeleteModal ref={modal} id={deleteItemId} />
        </div>
    );
}
