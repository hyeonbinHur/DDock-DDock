import MarketItem from './MarketItem';
import ItemDeleteModal from '../Modal/ItemDeleteModal';
import { useRef, useState } from 'react';
// import style from './MarketItemList.module.css';
import { Link } from 'react-router-dom';
export default function MarketList({ documents }) {
    const [deleteItemId, setDeleteItemId] = useState(null);
    const modal = useRef();

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
                        <Link to={doc.id}>
                            <MarketItem document={doc} />
                        </Link>
                        <button onClick={() => openConfirmModal(doc.id)}>
                            X
                        </button>
                    </li>
                ))}
            </ul>
            <ItemDeleteModal ref={modal} id={deleteItemId} />
        </div>
    );
}
