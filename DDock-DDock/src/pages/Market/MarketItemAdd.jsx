import { useFirestore } from '../../hooks/useFirestore';
import { useNavigate } from 'react-router-dom';
import MarketItemForm from '../../components/MarketItem/MarketItemForm';
import ItemModal from '../../components/Modal/ItemStatusModal'
import { useRef, useState } from 'react';
import { useDocument } from '../../hooks/useDocument';
import { useAuthContext } from '../../hooks/useAuth';

export default function AddMarketItem(){
    const {user} = useAuthContext();
    const { addDocument, response } = useFirestore('MarketItem');
    const { updateDocument } = useFirestore('User');
    const { document } = useDocument('User', user.uid);
    const [loading, setLoading] = useState(false)



    //유저 업데이트 함수를 불러와서, 아이템 정보를 몽땅 저장 
    const navigate = useNavigate();
    const modal = useRef();

    const doAddDocument = async (title,description) => {
        setLoading(true);
        modal.current.open();
        const newMItem = {
            type: "M_Item",
            title,
            description,
            comments: [],
        }
        await addDocument(newMItem);

        const originalUser = document;
        const originalUserItem = originalUser.userItem;
        const updatedUserItem = [...originalUserItem,newMItem];
        originalUser.userItem = updatedUserItem;

        await updateDocument(user.uid, originalUser);
        setLoading(false);
    };

    return (
        <>
        <ItemModal ref={modal} response={response} loading={loading} navigate={navigate}  from={"market"} />
        <MarketItemForm doAction={doAddDocument}/>
        </>
    );   
}