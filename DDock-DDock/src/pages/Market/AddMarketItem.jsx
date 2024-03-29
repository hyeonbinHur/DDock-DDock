import { useFirestore } from '../../hooks/useFirestore';
import { useNavigate } from 'react-router-dom';
import MarketItemForm from '../../components/MarketItem/MarketItemForm';
import ItemModal from '../../components/Modal/ItemStatusModal'
import { useRef } from 'react';

export default function AddMarketItem(){
    const { addDocument, response, loading } = useFirestore('MarketItem');
    
    const navigate = useNavigate();
    const modal = useRef();

    const doAddDocument = (title,description) => {
        modal.current.open();

        addDocument({
            title,
            description,
        });
    };

    return (
        <>
        <ItemModal ref={modal} response={response} loading={loading} navigate={navigate}  from={"market"} />
        <MarketItemForm doAction={doAddDocument}/>
        </>
    );   
}