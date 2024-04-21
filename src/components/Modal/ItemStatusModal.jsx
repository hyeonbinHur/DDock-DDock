import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import spinner from '../../assets/spinner.svg';

const ItemModal = forwardRef(function ItemStatusModal(
    { response, loading, from, navigate },
    ref
) {
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

                if (from === 'market') {
                    navigate('/market');
                }

                if(from === 'job'){
                    navigate('/job');
                }
            }, 1000);
            return () => clearTimeout(timer); // 컴포넌트가 언마운트 될 때 타이머 클리어
        }
    }, [response.success, navigate, from]);

    return createPortal(
        <div>
            <dialog ref={modal}>
                {loading === true && response.success === false && (
                    <img src={spinner} />
                )}
                {loading === false && response.success === true && (
                    <p>성공~!</p>
                )}{' '}
                {loading === false && response.success === false && (
                    <p>실패~!</p>
                )}
                <form method="dialog">
                    <button>close</button>
                </form>
            </dialog>
        </div>,
        document.getElementById('modal')
    );
});

export default ItemModal;
