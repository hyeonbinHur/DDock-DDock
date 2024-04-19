import { projectFirestore } from '../firebase/config';
import { useEffect, useState } from 'react';

export function useDocument(collection, id) {
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const ref = projectFirestore.collection(collection).doc(id);
        const unsubscribe = ref.onSnapshot(
            (snapshot) => {
                if (snapshot.data()) {
                    setDocument({ ...snapshot.data(), id: snapshot.id });
                    setError(null);
                } else {
                    setError('No such document exists');
                }
                setLoading(false);
            },
            (err) => {
                console.log(err.message);
                setError('failed to get document');
            }
        );
        return () => unsubscribe();
    }, [collection, id]);

    return { document, error, loading };
}
