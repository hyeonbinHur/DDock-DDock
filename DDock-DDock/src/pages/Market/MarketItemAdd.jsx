import { useFirestore } from '../../hooks/useFirestore';
import { useNavigate } from 'react-router-dom';
import MarketItemForm from '../../components/MarketItem/MarketItemForm';
import ItemModal from '../../components/Modal/ItemStatusModal'

import { useRef } from 'react';
import { useAuthContext } from '../../hooks/useAuth';

import { useDocument } from '../../hooks/useDocument';

export default function AddMarketItem(){
    const { addDocument, response ,loading } = useFirestore('MarketItem');

    const {user} = useAuthContext();
    const {document: userInfo} = useDocument('User', user?.uid)
    
    //유저 업데이트 함수를 불러와서, 아이템 정보를 몽땅 저장 
    const navigate = useNavigate();
    const modal = useRef();

    const doAddDocument = async (title,description,images,bucket) => {
        if(userInfo) {
            modal.current.open();
            const newMItem = {
                title,
                description,
                comments: [],
                images,
                bucket,
                location: {
                    si: userInfo.location.si,
                    gu: userInfo.location.gu,
                    dong: userInfo.location.dong,
                    lat: userInfo.location.lat,
                    lng: userInfo.location.lng
                }
            }
            await addDocument(newMItem,"M_Item","M_Item");
        }
     
    };

    const hello = () => {
        console.log(user)
        console.log(userInfo)
    }

    return (
        <>
        <button onClick={hello}>Console user</button>
        <ItemModal ref={modal} response={response} loading={loading} navigate={navigate}  from={"market"} />
        <MarketItemForm doAction={doAddDocument}/>
        </>
    );   
}