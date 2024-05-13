import { projectFirestore } from '../firebase/config';

export const addDocument = async (collection, item) => {
    const ref = projectFirestore.collection(collection);
    try {
        await ref.add({ ...item });
    } catch (error) {
        console.error(error);
    }
};
