import { projectFirestore } from '../firebase/config';

export const deleteDocument = async (collection, id) => {
    const ref = projectFirestore.collection(collection);

    try {
        await ref.doc(id).delete();
    } catch (error) {
        console.log(error);
    }
};
