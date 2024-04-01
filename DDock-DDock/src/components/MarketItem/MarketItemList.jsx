import MarketItem from './MarketItem';
import ItemDeleteModal from '../Modal/ItemDeleteModal';
import { useRef, useState } from 'react';
// import style from './MarketItemList.module.css';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuth';
export default function MarketList({ documents }) {
    const [deleteItemId, setDeleteItemId] = useState(null);
    const { user } = useAuthContext();
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
                        <Link to={ `/market/${doc.id}`}>
                            <p>{doc.id}</p>
                            <MarketItem document={doc} />
                        </Link>
                        {user && (doc.userId === user.uid && (
                            <button onClick={() => openConfirmModal(doc.id)}>
                                X
                            </button>
                        ))}
                    </li>
                ))}
            </ul>
            <ItemDeleteModal ref={modal} id={deleteItemId} />
        </div>
    );
}
