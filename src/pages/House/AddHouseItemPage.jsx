import { useAuthContext } from '../../hooks/useAuth';
import { useFirestore } from '../../hooks/useFirestore';
import { useDocument } from '../../hooks/useDocument';
import { getSydneyTimeISO } from '../../util/formDate';
import ItemAddForm from '../../components/Common/ItemAddForm';

export default function AddHouseItemPage() {
    const { user } = useAuthContext();
    const { document: userData } = useDocument('User', user?.uid);
    const { addDocument, response } = useFirestore('HouseItem');

    const addDocumentToServer = async (
        title,
        conditions,
        description,
        images,
        bucket,
        price,
        period
    ) => {
        if (userData) {
            const createdAt = getSydneyTimeISO();
            const newItem = {
                title,
                conditions,
                description,
                price,
                period,
                images,
                bucket,
                location: {
                    dong: userData.location.dong,
                },
                comments: [],
                createdAt,
                userId: userData.id,
                type: 'H_Item',
                interests: 0,
                numOfComment: 0,
            };
            await addDocument(newItem, 'HouseItem');
        }
    };

    return (
        <>
            {userData && (
                <ItemAddForm
                    addDocumentToServer={addDocumentToServer}
                    response={response}
                    Topic={'House'}
                    condition={true}
                    user={userData}
                />
            )}
        </>
    );
}
