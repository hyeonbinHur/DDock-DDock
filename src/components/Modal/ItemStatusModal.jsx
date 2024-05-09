import { AiOutlineClose } from 'react-icons/ai';
import { TbFaceIdError } from 'react-icons/tb';
import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useEffect,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import spinner4 from '../../assets/logo/spinner4.svg';
// import { useNavigate } from 'react-router-dom';
import { FcPrevious } from 'react-icons/fc';
import { FcNext } from 'react-icons/fc';

const ItemModal = forwardRef(function ItemStatusModal(
    {
        response,
        loading,
        from,
        navigate,
        title,
        conditions,
        description,
        previews,
        location,
        confirm,
    },
    ref
) {
    // const CloseNavigate = useNavigate();

    const modal = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useImperativeHandle(ref, () => {
        return {
            open: () => {
                modal.current.showModal();
            },
        };
    });

    useEffect(() => {
        if (response.success === true) {
            const timer = setTimeout(() => {
                modal.current.close();
                if (from === 'Market') {
                    navigate('/market');
                } else if (from === 'Job') {
                    navigate('/job');
                } else if (from == 'House') {
                    navigate('/house');
                } else if (from == 'Community') {
                    navigate('/community');
                }
            }, 1000);
            return () => clearTimeout(timer); // 컴포넌트가 언마운트 될 때 타이머 클리어
        }
    }, [response.success, navigate, from]);

    const closeError = () => {
        modal.current.close();
        if (from === 'Market') {
            navigate('/market');
        } else if (from === 'Job') {
            navigate('/job');
        } else if (from == 'House') {
            navigate('/house');
        } else if (from == 'Community') {
            navigate('/community');
        }
    };

    const confrimItem = () => {
        confirm();
    };

    return createPortal(
        <div>
            <dialog ref={modal} className="rounded-lg">
                {loading == true ? (
                    <img src={spinner4} />
                ) : response.success == false ? (
                    <div className="rounded-lg p-2 w-52 h-52 space-y-2 border-2 border-red-500">
                        <div className="flex justify-end items-end">
                            <AiOutlineClose onClick={() => closeError()} />
                        </div>
                        <div className="flex flex-col items-center">
                            <TbFaceIdError className="size-20 text-red-400" />
                            <p>An error has occurred. </p>
                            <p>Please try again later.</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-100 p-5 flex flex-col items-center justify-center">
                        <div className="w-96 h-[32rem] space-y-5 border rounded-lg">
                            {previews.length > 0 && (
                                <div className="flex items-center w-full h-2/5 rounded-lg pt-5">
                                    <div className="w-1/6 flex items-end justify-end">
                                        {currentIndex > 0 && (
                                            <FcPrevious
                                                className="size-8"
                                                onClick={() =>
                                                    setCurrentIndex(
                                                        (prev) => prev - 1
                                                    )
                                                }
                                            />
                                        )}
                                    </div>

                                    <img
                                        src={previews[currentIndex].url}
                                        className="w-8/12 h-full rounded-lg"
                                    />
                                    <div className="w-2/12">
                                        {currentIndex < previews.length - 1 && (
                                            <FcNext
                                                className="size-8"
                                                onClick={() =>
                                                    setCurrentIndex(
                                                        (prev) => prev + 1
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="w-full flex items-center justify-center">
                                <div className="text-sm font-bold">
                                    {currentIndex + 1} / {previews.length}
                                </div>
                            </div>

                            <div className="w-full flex ">
                                {/* padding */}
                                <div className="w-1/6"></div>
                                <div className="w-4/6 space-y-3">
                                    <div className="font-bold line-clamp-1">
                                        {title}
                                    </div>
                                    <div className="text-sm font-light text-gray-400">
                                        {location}
                                    </div>
                                    <div className="w-full border border-gray-200 "></div>
                                    {conditions.length > 0 && (
                                        // condition.map((i))
                                        <div>
                                            {conditions.map((condition) => (
                                                <div
                                                    key={condition.id}
                                                    className="line-clamp-1 text-sm font-bold"
                                                >
                                                    {condition.value}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="line-clamp-3">
                                        {description}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-5 mt-3">
                            <div
                                className="border p-1 rounded border-red-200 text-red-200 hover:scale-90 hover:bg-red-300 hover:text-white"
                                onClick={() => modal.current.close()}
                            >
                                edit
                            </div>
                            <div
                                className="border p-1 rounded border-sky-400 text-sky-400 hover:scale-90 hover:bg-sky-400 hover:text-white"
                                onClick={confrimItem}
                            >
                                confrim
                            </div>
                        </div>
                    </div>
                )}
            </dialog>
        </div>,
        document.getElementById('modal')
    );
});

export default ItemModal;
