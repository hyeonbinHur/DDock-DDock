import { useState } from "react";

// Props를 객체 구조 분해를 사용해 정의
export default function ListHeader({ si, gu, dong, updateSearchContent, modalOpenFn, selectPlaceFn, checked }) {
    const [searchContent, setSearchContent] = useState('');

    const onChangeSearchContent = (event) => {
        const newContent = event.target.value;
        setSearchContent(newContent);
        updateSearchContent(newContent); // 오타 수정
    };

    return (
        <div>
            <div>
                <input
                    type="search"
                    placeholder="찾는 물건을 검색해 보세요"
                    value={searchContent}
                    onChange={onChangeSearchContent}
                />
            </div>
            <div>
                <span>
                    {si}
                    <input
                        type="radio"
                        value="si"
                        checked={checked === 'si'}
                        onChange={(event) => selectPlaceFn(event.target.value)}
                    />
                    /
                </span>

                <span>
                    {gu}{' '}
                    <input
                        type="radio"
                        value="gu"
                        checked={checked === 'gu'}
                        onChange={(event) => selectPlaceFn(event.target.value)}
                    />
                    /
                </span>

                <span>
                    {dong}
                    <input
                        type="radio"
                        value="dong"
                        checked={checked === 'dong'}
                        onChange={(event) => selectPlaceFn(event.target.value)}
                    />
                    /
                </span>
                <button onClick={modalOpenFn}>내 위치 설정</button>
            </div>
        </div>
    );
}
