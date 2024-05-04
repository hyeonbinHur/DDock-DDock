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
import { deleteHouseItem } from '../../store/houseCollectionSilce';
import { deleteCommunityItem } from '../../store/communityCollectionSlice';

const ItemDeleteModal = forwardRef(function ItemStatusModal(
    { id, from, navigate, collection },
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
            } else if (from == 'job') {
                dispatch(deleteJobItem({ id: id }));
            } else if (from == 'House') {
                dispatch(deleteHouseItem({ id: id }));
            } else if (from == 'Community') {
                dispatch(deleteCommunityItem({ id: id }));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, response]);

    const deleteItem = async () => {
        setConfirm(true);
        await deleteDocument(id, collection);

        const originalUserInfo = userInfo;
        if (from == 'market') {
            const updatedUserItem = originalUserInfo.MItem.filter(
                (item) => item.id !== id
            );
            originalUserInfo.MItem = updatedUserItem;
            await updateDocument(user.uid, originalUserInfo, 'User');
        } else if (from == 'job') {
            const updatedUserItem = originalUserInfo.JItem.filter(
                (item) => item.id !== id
            );
            originalUserInfo.JItem = updatedUserItem;
            await updateDocument(user.uid, originalUserInfo, 'User');
        } else if (from == 'House') {
            const updatedUserItem = originalUserInfo.HItem.filter(
                (item) => item.id !== id
            );
            originalUserInfo.HItem = updatedUserItem;
            await updateDocument(user.uid, originalUserInfo, 'User');
        } else if (from == 'Community') {
            const updatedUserItem = originalUserInfo.CItem.filter(
                (item) => item.id !== id
            );
            originalUserInfo.CItem = updatedUserItem;
            await updateDocument(user.uid, originalUserInfo, 'User');
        }
    };

    function handleClose() {
        modal.current.close();
        setConfirm(false); // 모달을 닫을 때 confirm 상태도 초기화
        if (from == 'market') {
            navigate('/market');
        } else if (from == 'job') {
            navigate('/job');
        } else if (from == 'House') {
            navigate('/house');
        } else if (from == 'Community') {
            navigate('/community');
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
