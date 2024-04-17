import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import spinner from '../../assets/spinner.svg';
import { useFirestore } from '../../hooks/useFirestore';
import { useDocument } from '../../hooks/useDocument';
import { useAuthContext } from '../../hooks/useAuth';

const ItemDeleteModal = forwardRef(function ItemStatusModal({ id }, ref) {
    const { deleteDocument, updateDocument ,loading, response } = useFirestore('MarketItem');
    const [confirm, setConfirm] = useState(false);
    const modal = useRef(null);
    const {user} = useAuthContext();
    const { document: userInfo } = useDocument('User', user.uid);

    useImperativeHandle(ref, () => {
        return {
            open: () => {
                modal.current.showModal();
            },
            close: () => {
                modal.current.close();
            },
        };
    });

    const deleteItem = async()=> {
        setConfirm(true);
        await deleteDocument(id);
        const originalUserInfo = userInfo;
        const updatedUserItem = originalUserInfo.userItem.filter(
            (item) => item.id !== id
        );
        originalUserInfo.userItem = updatedUserItem;
        await updateDocument(user.uid, originalUserInfo, 'User');
    }
    function handleClose() {
        modal.current.close();
        setConfirm(false); // 모달을 닫을 때 confirm 상태도 초기화
    }
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
                    <button onClick={handleClose}>close</button>
                </form>
            </dialog>
        </div>,
        document.getElementById('modal')
    );
});

export default ItemDeleteModal;
