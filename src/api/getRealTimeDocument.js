import { projectFirestore } from '../firebase/config';

export const getRealTimeDocument = (collection, id, onUpdate, onError) => {
    const docRef = projectFirestore.collection(collection).doc(id);

    return docRef.onSnapshot((docSnapshot) => {
        if (docSnapshot.exists) {
            onUpdate({ id: docSnapshot.id, ...docSnapshot.data() });
        } else {
            onError(new Error('Document does not exist'));
        }
    }, (error) => {
        onError(error);
    });
};