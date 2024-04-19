import { projectFirestore } from '../firebase/config';

export const getDocument = async (collection, id) => {
    const docRef = projectFirestore.collection(collection).doc(id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        throw new Error('Document does not exist');
    }
};


