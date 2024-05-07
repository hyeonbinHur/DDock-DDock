import { useFirestore } from '../../hooks/useFirestore';
// import MarketItemForm from '../../components/MarketItem/MarketItemForm';
import { useAuthContext } from '../../hooks/useAuth';
import { getSydneyTimeISO } from '../../util/formDate';
import ItemAddForm from '../../components/Common/ItemAddForm';

import { useDocument } from '../../hooks/useDocument';

export default function AddMarketItem() {
    const { user } = useAuthContext();
    const { document: userData } = useDocument('User', user?.uid);
    const { addDocument, response } = useFirestore('MarketItem');

    //유저 업데이트 함수를 불러와서, 아이템 정보를 몽땅 저장

    const addDocumentToServer = async (
        title,
        conditions,
        description,
        images,
        bucket
    ) => {
        if (userData) {
            const createdAt = getSydneyTimeISO();
            const newMItem = {
                title,
                description,
                conditions,
                comments: [],
                images,
                bucket,
                location: {
                    dong: userData.location.dong,
                },
                createdAt: createdAt,
                userId: userData.id,
                type: 'M_Item',
                interests: 0,
                numOfComment: 0,
            };
            await addDocument(newMItem, 'marketItem');
        }
    };

    return (
        <>
            {userData && (
                <ItemAddForm
                    addDocumentToServer={addDocumentToServer}
                    response={response}
                    Topic={'Market'}
                    condition={false}
                    user={userData}
                />
            )}
        </>
    );
}
