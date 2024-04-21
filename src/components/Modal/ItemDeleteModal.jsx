import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import spinner from '../../assets/spinner.svg';
import { useFirestore } from '../../hooks/useFirestore';
import { useDocument } from '../../hooks/useDocument';
import { useAuthContext } from '../../hooks/useAuth';
import { deleteItemFromRedux } from '../../store/marketCollectionSlice';
import { useDispatch } from 'react-redux';
import { deleteJobItem } from '../../store/jobCollectionSlice';


const ItemDeleteModal = forwardRef(function ItemStatusModal(
    { id, from, navigate,collection },
    ref
) {
    const { deleteDocument, updateDocument, loading, response } =
        useFirestore('MarketItem');
    const [confirm, setConfirm] = useState(false);
    const modal = useRef(null);
    const { user } = useAuthContext();
    const { document: userInfo } = useDocument('User', user.uid);
    const dispatch = useDispatch();

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

    useEffect(() => {
        if (!loading && response.success) {
            if (from == 'market') {
                dispatch(deleteItemFromRedux({ id: id }));
            }else if(from == 'job'){
                dispatch(deleteJobItem({id:id}))
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, response]);

    const deleteItem = async () => {
        setConfirm(true);
        await deleteDocument(id,collection);

        const originalUserInfo = userInfo;
        const updatedUserItem = originalUserInfo.userItem.filter(
            (item) => item.id !== id
        );
        originalUserInfo.userItem = updatedUserItem;
        await updateDocument(user.uid, originalUserInfo, 'User');
    };

    function handleClose() {
        modal.current.close();
        setConfirm(false); // 모달을 닫을 때 confirm 상태도 초기화
        if(from == 'market'){
            navigate('/market');
        }else if(from == 'job'){
            navigate('/job');
        }
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
