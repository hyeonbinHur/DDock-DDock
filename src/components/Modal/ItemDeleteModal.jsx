import { AiOutlineCheck } from 'react-icons/ai';
import { GrStatusWarning } from 'react-icons/gr';
import { AiOutlineClose } from 'react-icons/ai';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useFirestore } from '../../hooks/useFirestore';
import { useDocument } from '../../hooks/useDocument';
import { useAuthContext } from '../../hooks/useAuth';
import { deleteItemFromRedux } from '../../store/marketCollectionSlice';
import { useDispatch } from 'react-redux';
import { deleteJobItem } from '../../store/jobCollectionSlice';
import { deleteHouseItem } from '../../store/houseCollectionSilce';
import { deleteCommunityItem } from '../../store/communityCollectionSlice';

import spinner4 from '../../assets/logo/spinner4.svg';

import { TbFaceIdError } from 'react-icons/tb';

const ItemDeleteModal = forwardRef(function ItemStatusModal(
    { id, from, navigate, collection, bucket, images },
    ref
) {
    const { deleteDocument, updateDocument, loading, response } =
        useFirestore('MarketItem');
    const [confirm, setConfirm] = useState(false);
    const modal = useRef(null);
    const { user } = useAuthContext();
    const { document: userInfo } = useDocument('User', user?.uid);
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
        await deleteDocument(id, collection, bucket, images);

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
            <dialog ref={modal} className="rounded-md">
                {confirm === true ? (
                    <>
                        {loading === true && response.success === false && (
                            <img src={spinner4} alt="Loading" />
                        )}
                        {loading === false && response.success === true && (
                            <div className="p-3 space-y-3">
                                <div className="flex items-center justify-center text-sky-400">
                                    <AiOutlineCheck className="size-16" />
                                </div>
                                <div className="space-y-4">
                                    <div className="w-full border border-gray-300"></div>
                                    <div>
                                        The item has been successfully deleted.
                                    </div>
                                    <div className="w-full border border-gray-300"></div>
                                </div>

                                <div className="flex items-end justify-end">
                                    <div
                                        className="border rounded-md bg-sky-400 text-white px-3 py-1 hover:scale-90 cursor-pointer"
                                        onClick={handleClose}
                                    >
                                        OK
                                    </div>
                                </div>
                            </div>
                        )}
                        {loading === false && response.success === false && (
                            <div className="rounded-lg p-2 w-52 h-52 space-y-2 border-2 border-red-500">
                                <div className="flex justify-end items-end">
                                    <AiOutlineClose
                                        onClick={() => modal.current.close()}
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <TbFaceIdError className="size-20 text-red-400" />
                                    <p>An error has occurred. </p>
                                    <p>Please try again later.</p>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="p-3 w-[26rem]">
                        <div className="flex items-end justify-end">
                            <AiOutlineClose
                                className=" hover:scale-95 hover:text-gray-400  cursor-pointer"
                                onClick={() => modal.current.close()}
                            />
                        </div>
                        <div className="flex flex-col p-3 space-y-3">
                            <div className="text-red-400 flex items-center justify-center">
                                <GrStatusWarning className="size-20" />
                            </div>
                            <div className="space-y-4">
                                <div className="w-full border-[1px] border-gray-300"></div>
                                <div className="break-words">
                                    Are you sure you want to delete this item?
                                    This action cannot be undone.
                                </div>
                                <div className="w-full border-[1px] border-gray-300"></div>
                            </div>
                        </div>
                        <div className="flex space-x-3 justify-end items-end ">
                            <div
                                className="bg-gray-100 rounded-md p-2 px-3 cursor-pointer"
                                onClick={() => modal.current.close()}
                            >
                                Cancle
                            </div>
                            <div
                                className="bg-red-500  text-white p-2 rounded-md px-3 cursor-pointer"
                                onClick={deleteItem}
                            >
                                Delete
                            </div>
                        </div>
                    </div>
                )}
            </dialog>
        </div>,
        document.getElementById('modal')
    );
});

export default ItemDeleteModal;
