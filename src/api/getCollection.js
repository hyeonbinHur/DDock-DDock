import { projectFirestore } from "../firebase/config";

export const getCollection = async (collection, orderby) => {
    let ref = projectFirestore.collection(collection);
    if (orderby) {
        ref = ref.orderBy(...orderby);
    }
    const snapshot = await ref.get();
    let results = [];
    snapshot.docs.forEach(doc => {
        results.push({ ...doc.data(), id: doc.id });
    });
    return results;
};