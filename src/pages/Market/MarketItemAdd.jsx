import { useFirestore } from '../../hooks/useFirestore';
import MarketItemForm from '../../components/MarketItem/MarketItemForm';
import { useDispatch } from 'react-redux';
import { useAuthContext } from '../../hooks/useAuth';
import { addItem } from '../../store/marketCollectionSlice';
import { getSydneyTimeISO } from '../../util/formDate';


import { useDocument } from '../../hooks/useDocument';

export default function AddMarketItem(){
    const { addDocument, response, loading} = useFirestore('MarketItem');
    const dispatch = useDispatch();
    const {user} = useAuthContext();
    const {document: userInfo} = useDocument('User', user?.uid)
    
    //유저 업데이트 함수를 불러와서, 아이템 정보를 몽땅 저장 

    const doAddDocument = async (title,description,images,bucket) => {
        if(userInfo) {
            const createdAt = getSydneyTimeISO();
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
                },
                createdAt: createdAt,
                userId: userInfo.id,
                type: "M_Item",
                subtype: "M_Item",
                interests: 0,
            }
            await addDocument(newMItem,"M_Item","M_Item");
            dispatch(addItem(newMItem));
        }
     
    };

    const hello = () => {
        console.log(user)
        console.log(userInfo)
    }

    return (
        <>
        <button onClick={hello}>Console user</button>
        <MarketItemForm doAction={doAddDocument} response={response} loading={loading}/>
        </>
    );   
}