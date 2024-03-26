import { useEffect, useState } from 'react';
import { projectFirestore } from '../firebase/config';

export const useCollection = (collection) => {
    const [document, setDocuments] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ref = projectFirestore.collection(collection);

        const unsubscribe = ref.onSnapshot(
            (snapshot) => {
                let results = [];
                snapshot.docs.forEach((doc) => {
                    console.log(doc);
                    results.push({ ...doc.data(), id: doc.id });
                }); // update state
                setDocuments(results);
                setError(null);
                setLoading(false);
            },
            (error) => {
                console.log(error);
                setError('could not fetch the data');
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, [collection]);

    return { document, error, loading };
};
