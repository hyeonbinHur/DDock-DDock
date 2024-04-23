import { useState } from 'react';
import search from '../../assets/vector/search.png';

// Props를 객체 구조 분해를 사용해 정의
export default function ListHeader({
    si,
    gu,
    dong,
    updateSearchContent,
    modalOpenFn,
    selectPlaceFn,
    checked,
}) {
    const [searchContent, setSearchContent] = useState('');

    const onChangeSearchContent = (event) => {
        const newContent = event.target.value;
        setSearchContent(newContent);
        updateSearchContent(newContent);
    };

    return (
        <div className="mt-5">
            <div className="flex ml-48 justify-between">
                <div className="flex  w-7/12 border-2 border-gray-200 rounded-md items-center pl-2 hover:border-gray-500 hover:bg-gray-100">
                    <img src={search} className="w-5 h-7 mr-2" />
                    <input
                        className="w-full bg-transparent focus:outline-none"
                        type="search"
                        placeholder="Search title or description"
                        value={searchContent}
                        onChange={onChangeSearchContent}
                    />
                </div>
            </div>

            <div className="flex ml-48">
                <div className=" pt-5 pb-5 flex">
                    <div
                        className="border-2 rounded-md pr-2 mr-6 cursor-pointer"
                        onClick={() => selectPlaceFn('si')}
                    >
                        <span className="pr-3 pl-3">{si}</span>
                        <input
                            className="cursor-pointer"
                            type="radio"
                            value="si"
                            checked={checked === 'si'}
                            onChange={(event) =>
                                selectPlaceFn(event.target.value)
                            }
                        />
                    </div>

                    <div
                        className="border-2 rounded-md pr-2 mr-6 cursor-pointer"
                        onClick={() => selectPlaceFn('gu')}
                    >
                        <span className="pr-2 pl-2"> {gu}</span>

                        <input
                            className="cursor-pointer"
                            type="radio"
                            value="gu"
                            checked={checked === 'gu'}
                            onChange={(event) =>
                                selectPlaceFn(event.target.value)
                            }
                        />
                    </div>

                    <div
                        className="border-2 rounded-md pr-2 mr-6 cursor-pointer "
                        onClick={() => selectPlaceFn('dong')}
                    >
                        <span className="pr-2 pl-2">{dong}</span>
                        <input
                            className="cursor-pointer"
                            type="radio"
                            value="dong"
                            checked={checked === 'dong'}
                            onChange={(event) =>
                                selectPlaceFn(event.target.value)
                            }
                        />
                    </div>
                    <div className="border-2 rounded-md pr-2 mr-6  border-blue-200 bg-blue-400 text-white ">
                        <button className="pr-2 pl-2" onClick={modalOpenFn}>
                            Set position
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
