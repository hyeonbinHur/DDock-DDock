import { useEffect, useState, useRef } from 'react';
import { projectFirestore } from '../firebase/config';

export const useCollection = (collection, _orderby) => {
    const [document, setDocuments] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // 초기 로딩 상태를 true로 설정

    const orderby = useRef(_orderby).current;
    useEffect(() => {
        setLoading(true); // 이 부분을 추가하여 컴포넌트가 마운트될 때마다 로딩 상태를 재설정
        let ref = projectFirestore.collection(collection);
        if (orderby) {
            ref = ref.orderBy(...orderby);
        }
        const unsubscribe = ref.onSnapshot(
            (snapshot) => {
                let results = [];
                snapshot.docs.forEach((doc) => {
                    results.push({ ...doc.data(), id: doc.id });
                });
                setDocuments(results);
                setError(null);
                setLoading(false); // 데이터 로드 완료
            },
            (error) => {
                console.error(error);
                setError('could not fetch the data');
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, [collection, orderby]);

    return { document, error, loading };
};
