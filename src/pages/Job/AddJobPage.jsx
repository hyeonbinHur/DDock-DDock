import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuth';
import { getSydneyTimeISO } from '../../util/formDate';
import { useDocument } from '../../hooks/useDocument';
import JobItemAddForm from '../../components/JobItem/JobItemAddForm';

export default function AddJobPage() {
    const { addDocument, response, loading } = useFirestore('JobItem');
    const { user } = useAuthContext();
    const { document: userData } = useDocument('User', user?.uid);

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
                    si: userData.location.si,
                    gu: userData.location.gu,
                    dong: userData.location.dong,
                },
                comments:[],
                createdAt,
                userId: userData.id,
                type: 'J_Item',
                interests: 0,
                numOfComment: 0,
            };
            await addDocument(newItem, "jobItem");
        }
    };

    return <> {userData && <JobItemAddForm addDocumentToServer = {addDocumentToServer} response = {response} loading = {loading} />} </>;
}
