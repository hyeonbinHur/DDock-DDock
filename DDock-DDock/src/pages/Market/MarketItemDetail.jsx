import { Link, useParams } from 'react-router-dom';
import { useFirestore } from '../../hooks/useFirestore';
import { useEffect, useState } from 'react';

export default function MarketItemDetail() {
    const { mitemId } = useParams();
    const { getOneItem, response } = useFirestore('MarketItem');
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
    const [error, setError] = useState(null); // 에러 상태 추가

    // 데이터를 가져오는 작업
    useEffect(() => {
        setIsLoading(true); // 로딩 시작
        getOneItem(mitemId)
            .finally(() => setIsLoading(false)); // 로딩 종료
    }, [mitemId]); // 의존성 배열에서 getOneItem 제거

    // response 상태의 변화를 감지하여 로컬 상태를 업데이트하는 작업
    useEffect(() => {
        console.log("리스폰스 변경")
        if (response.success) {
            console.log("success")
            setItem(response.document);
        } else if (response.error) {
            console.log("fail")
            setError(response.error); // 에러 상태 업데이트
        }
    }, [response]);

    // 로딩 중이거나, 에러가 있거나, 아이템을 찾을 수 없을 때의 처리
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>; // 에러 표시
    if (!item) return <div>No item found</div>;

    return (
        <>
            <p>ID: {item.id}</p>
            <p>Title: {item.title || "null"}</p>
            <p>Description: {item.description || "null"}</p>
            <Link to={`../mupdate/${mitemId}`}>Go to edit</Link>
        </>
    );
}
