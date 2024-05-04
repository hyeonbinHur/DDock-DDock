import { useAuthContext } from '../../hooks/useAuth';
import { useFirestore } from '../../hooks/useFirestore';
import { useDocument } from '../../hooks/useDocument';
import { getSydneyTimeISO } from '../../util/formDate';
import ItemAddForm from '../../components/Common/ItemAddForm';

export default function AddCommunityItemPage() {
    const { user } = useAuthContext();
    const { document: userData } = useDocument('User', user?.uid);
    const { addDocument, response } = useFirestore('CommunityItem');

    const addDocumentToServer = async (
        title,
        conditions,
        description,
        images,
        bucket
    ) => {
        if (userData) {
            const createdAt = getSydneyTimeISO();
            const newItem = {
                title,
                conditions,
                description,
                images,
                bucket,
                location: {
                    dong: userData.location.dong,
                },
                comments: [],
                createdAt,
                userId: userData.id,
                type: 'C_Item',
                interests: 0,
                numOfComment: 0,
            };
            await addDocument(newItem, 'CommunityItem');
        }
    };

    return (
        <>
            {userData && (
                <ItemAddForm
                    addDocumentToServer={addDocumentToServer}
                    response={response}
                    Topic={'Community'}
                    condition={false}
                />
            )}
        </>
    );
}
