import { useFirestore } from '../../hooks/useFirestore';
import { useNavigate } from 'react-router-dom';
import MarketItemForm from '../../components/MarketItem/MarketItemForm';
import ItemModal from '../../components/Modal/ItemStatusModal'
import { useRef } from 'react';

export default function AddMarketItem(){
    const { addDocument, response ,loading } = useFirestore('MarketItem');
    
    //유저 업데이트 함수를 불러와서, 아이템 정보를 몽땅 저장 
    const navigate = useNavigate();
    const modal = useRef();

    const doAddDocument = async (title,description,images,bucket) => {
        modal.current.open();
        const newMItem = {
            title,
            description,
            comments: [],
            images,
            bucket
        }
        await addDocument(newMItem,"M_Item","M_Item");
    };

    return (
        <>
        <ItemModal ref={modal} response={response} loading={loading} navigate={navigate}  from={"market"} />
        <MarketItemForm doAction={doAddDocument}/>
        </>
    );   
}