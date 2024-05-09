import { AiFillCaretUp } from 'react-icons/ai';
import { AiFillCaretDown } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import search from '../../assets/vector/search.png';
import style from './ListHeader.module.css';
import { useAuthContext } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
// Props를 객체 구조 분해를 사용해 정의
export default function ListHeader({
    updateSearchContent,
    modalOpenFn,
    selectPlaceFn,
    topic,
}) {
    const [searchContent, setSearchContent] = useState('');
    const [buttonStyleCss, setButtonStyleCss] = useState('');
    const [selectPlace, setSelectedPlace] = useState('All Items');
    const [showPlaceMenu, setShowPlaceMenu] = useState(false);
    const { user } = useAuthContext();
    const navigate = useNavigate();
    useEffect(() => {
        if (topic === 'community') {
            setButtonStyleCss(style.community_container);
        } else if (topic === 'house') {
            setButtonStyleCss(style.house_container);
        } else if (topic === 'job') {
            setButtonStyleCss(style.job_container);
        } else if (topic === 'market') {
            setButtonStyleCss(style.market_container);
        }
    }, [topic]);

    const onChangeSearchContent = (event) => {
        const newContent = event.target.value;
        setSearchContent(newContent);
        updateSearchContent(newContent);
    };

    const setPlace = (value) => {
        setShowPlaceMenu(false);
        setSelectedPlace(value);
        selectPlaceFn(value);
    };

    const navigateToAdd = () => {
        if (!user) {
            navigate(`/login`);
        } else {
            navigate(`/${topic}/add`);
        }
    };

    return (
        <div className="top-24 w-full z-10 bg-white">
            <div className="pl-44 w-full bg-white">
                <div className="text-4xl font-bold pb-7 uppercase">{topic}</div>
                <div className="flex justify-between">
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
                    <div className="pr-40">
                        <div className={buttonStyleCss}>
                            <button onClick={modalOpenFn}>Set position</button>
                        </div>
                        <div
                            className={buttonStyleCss}
                            onClick={() => navigateToAdd()}
                        >
                            Add item
                        </div>
                    </div>
                </div>

                <div className="flex pb-3">
                    <div className="flex space-x-5">
                        <div
                            className="border-2 rounded-md pr-2 mr-6 cursor-pointer "
                            onClick={() => setShowPlaceMenu((prev) => !prev)}
                        >
                            <span className="pl-3 flex items-center">
                                {selectPlace}
                                {showPlaceMenu ? (
                                    <AiFillCaretUp className="ml-3" />
                                ) : (
                                    <AiFillCaretDown className="ml-3" />
                                )}
                            </span>
                        </div>
                    </div>
                </div>
                {showPlaceMenu && (
                    <div className="border absolute z-20 bg-gray-50 w-1/3 p-3 space-y-2 rounded-md font-semibold text-lg">
                        <div
                            className="w-full hover:bg-neutral-200 p-2 rounded"
                            onClick={() => setPlace('All Items')}
                        >
                            All Items
                        </div>
                        <div
                            className="w-full hover:bg-neutral-200 p-2 rounded"
                            onClick={() => setPlace('North Melbourne')}
                        >
                            North Melbourne
                        </div>
                        <div
                            className="w-full hover:bg-neutral-200 p-2 rounded"
                            onClick={() => setPlace('Parkville')}
                        >
                            Parkville
                        </div>
                        <div
                            className="w-full hover:bg-neutral-200 p-2 rounded"
                            onClick={() => setPlace('South Wharf')}
                        >
                            South Wharf
                        </div>
                        <div
                            className="w-full hover:bg-neutral-200 p-2 rounded"
                            onClick={() => setPlace('Southbank')}
                        >
                            Southbank
                        </div>
                        <div
                            className="w-full hover:bg-neutral-200 p-2 rounded"
                            onClick={() => setPlace('West Melbourne')}
                        >
                            West Melbourne
                        </div>
                        <div
                            className="w-full hover:bg-neutral-200 p-2 rounded"
                            onClick={() => setPlace('Carlton')}
                        >
                            Carlton
                        </div>
                        <div
                            className="w-full hover:bg-neutral-200 p-2 rounded"
                            onClick={() => setPlace('Docklands')}
                        >
                            Docklands
                        </div>
                        <div
                            className="w-full hover:bg-neutral-200 p-2 rounded"
                            onClick={() => setPlace('East Melbourne')}
                        >
                            East Melbourne
                        </div>
                        <div
                            className="w-full hover:bg-neutral-200 p-2 rounded"
                            onClick={() => setPlace('Kensington')}
                        >
                            Kensington
                        </div>
                        <div
                            className="w-full hover:bg-neutral-200 p-2 rounded"
                            onClick={() => setPlace('Melbourne CBD')}
                        >
                            Melbourne CBD
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
