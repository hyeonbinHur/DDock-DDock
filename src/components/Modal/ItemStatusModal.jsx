import { AiOutlineClose } from 'react-icons/ai';
import { TbFaceIdError } from 'react-icons/tb';
import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import spinner4 from '../../assets/logo/spinner4.svg';
import { useNavigate } from 'react-router-dom';

const ItemModal = forwardRef(function ItemStatusModal(
    { response, loading, from, navigate },
    ref
) {
    const CloseNavigate = useNavigate();
    const modal = useRef(null);
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

    return createPortal(
        <div>
            <dialog ref={modal} className="rounded-lg">
                {loading === true && <img src={spinner4} />}
                {loading === false && response.success === true && (
                    <p>성공~!</p>
                )}{' '}
                {loading === false && response.success === false && (
                    <div className="rounded-lg p-2 w-52 h-52 space-y-2 border-2 border-red-500">
                        <div className="flex justify-end items-end">
                            <AiOutlineClose onClick={() => CloseNavigate(-1)} />
                        </div>
                        <div className="flex flex-col items-center">
                            <TbFaceIdError className="size-20 text-red-400" />
                            <p>An error has occurred. </p>
                            <p>Please try again later.</p>
                        </div>
                    </div>
                )}
                <form method="dialog"></form>
            </dialog>
        </div>,
        document.getElementById('modal')
    );
});

export default ItemModal;
