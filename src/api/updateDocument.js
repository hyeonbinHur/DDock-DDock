import { projectFirestore } from '../firebase/config';

export const updateDoc = async (collection, id, item) => {
    const ref = projectFirestore.collection(collection);
    try {
        await ref.doc(id).update(item);
    } catch (error) {
        console.log(error);
    }
};

export const updateTitle = async (collection, id, title) => {
    const ref = projectFirestore.collection(collection);
    try {
        await ref.doc(id).update({
            title: title,
        });
    } catch (error) {
        console.log(error);
    }
};
