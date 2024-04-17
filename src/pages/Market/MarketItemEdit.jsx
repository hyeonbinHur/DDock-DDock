import { useNavigate, useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { useFirestore } from '../../hooks/useFirestore';
import ItemModal from '../../components/Modal/ItemStatusModal';
import MarketItemEditForm from '../../components/MarketItem/MarketItemEditForm'
import { useRef } from 'react';
export default function MarketItemEdit() {
    const { mitemId } = useParams();
    const { document, error } = useDocument('MarketItem', mitemId);
    const { updateDocument,response, loading } = useFirestore('MarketItem');
    const modal = useRef();
    const navigate = useNavigate();
    
    if (error) {
        return <div className="error">{error}</div>;
    }
    if (!document) {
        return <div className="loading">Loading...</div>;
    }

    const doEditDocument = (title, description) => {
        modal.current.open();

        updateDocument(mitemId, {
            title,
            description,        
        },'MarketItem');
    };

    const Hello = () =>{
        console.log(Hello);
    }

    return (
        <>
            <ItemModal
                ref={modal}
                response={response}
                loading={loading}
                navigate={navigate}
                from={'market'}
            />

            <MarketItemEditForm doAction={Hello} data={document} />
        </>
    );
}
