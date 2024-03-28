import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useEffect,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import spinner from '../../assets/spinner.svg';
import { useFirestore } from '../../hooks/useFirestore';

const ItemDeleteModal = forwardRef(function ItemStatusModal(
    { id },
    ref
) {
    const { deleteDocument,loading, response } = useFirestore('MarketItem');

    const [confirm, setConfirm] = useState(false);
    const modal = useRef(null);
    
    useImperativeHandle(ref, () => {
        return {
            open: () => {
                modal.current.showModal();
            },
        };
    });

    function deleteItem(){
        setConfirm(true);
        deleteDocument(id);
    }

    useEffect(() => {
        console.log('from modal ' + response.success);
        if (response.success === true) {
            const timer = setTimeout(() => {
                modal.current.close();
            }, 1000);
            return () => clearTimeout(timer); // 컴포넌트가 언마운트 될 때 타이머 클리어
        }
    }, [response.success ]);

    return createPortal(
        <div>
            <dialog ref={modal}>
                {confirm === true ? (
                    <>
                        {loading === true && response.success === false && (
                            <img src={spinner} alt="Loading" />
                        )}
                        {loading === false && response.success === true && (
                            <p>성공~!</p>
                        )}
                        {loading === false && response.success === false && (
                            <p>실패~!</p>
                        )}
                    </>
                ) : (
                    <button onClick={deleteItem}>
                        아이템을 진짜 삭제할거에요?
                    </button>
                )}

                <form method="dialog">
                    <button>close</button>
                </form>
            </dialog>
        </div>,
        document.getElementById('modal')
    );
});

export default ItemDeleteModal;
