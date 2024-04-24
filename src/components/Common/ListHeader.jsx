import { useState } from 'react';
import search from '../../assets/vector/search.png';
import { Link } from 'react-router-dom';

// Props를 객체 구조 분해를 사용해 정의
export default function ListHeader({
    si,
    gu,
    dong,
    updateSearchContent,
    modalOpenFn,
    selectPlaceFn,
    checked,
    topic
}) {
    const [searchContent, setSearchContent] = useState('');

    const onChangeSearchContent = (event) => {
        const newContent = event.target.value;
        setSearchContent(newContent);
        updateSearchContent(newContent);
    };

    return (
        <div className="top-24 w-full z-10 bg-white">
            <div className="pl-44 w-full bg-white">
                <div className="text-4xl font-bold pb-7 uppercase">{topic}</div>
                <div className='flex justify-between'>
                    <div className="flex w-96 mt-2 max-h-10 min-h-10 justify-between">
                        <div className="flex rounded-lg w-full border-2 border-black items-center pl-2 hover:border-gray-500 hover:bg-gray-100 focus:bg-gray-100">
                            <img src={search} className="w-5 h-5 mr-2" />
                            <input
                                className="w-full bg-transparent focus:outline-none "
                                type="search"
                                placeholder="Search title or description"
                                value={searchContent}
                                onChange={onChangeSearchContent}
                                onFocus={(e) => e.target.parentNode.focus()}
                            />
                        </div>
                    </div>
                    <div className='pr-40'>
                        <div className="border-2 rounded-md w-24 h-9 mb-5 border-blue-400  text-blue-400 flex items-center justify-center">
                            <button  onClick={modalOpenFn}>
                                Set position
                            </button>
                        </div> 
                        <div className="border-2 rounded-md h-9 border-blue-400  text-blue-400 flex items-center justify-center">
                            <Link to={`/${topic}/add`}>Add item</Link>
                        </div>
                    </div>
                </div>

                <div className="flex pb-3">
                    <div className="flex">
                        <div
                            className="border-2 rounded-mdcursor-pointer"
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
                    </div>
                </div>
            </div>
        </div>
    );
}
