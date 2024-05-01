import { useDocument } from '../../hooks/useDocument';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { open } from '../../store/chatRoomSlice';

export default function ChattingRoomListItem({ room, userId }) {
    const { document: partner } = useDocument('User', room.partner);
    const [unreadChat, setUnreadChat] = useState([]);
    const { document: currentUser } = useDocument('User', userId);

    useEffect(() => {
        if (currentUser) {
            currentUser.unread.forEach((unreadRoom) => {
                if (unreadRoom.roomId === room.roomId) {
                    setUnreadChat(unreadRoom.chat);
                }
            });
        }
    }, [room.roomId, currentUser, currentUser?.unread]);

    const dispatch = useDispatch();

    return (
        <div className="flex w-full items-center justify-end px-3 py-2 hover:bg-gray-100 mt-2 rounded-md font-semibold cursor-pointer">
            {partner && currentUser && (
                <div
                    onClick={() =>
                        dispatch(
                            open({ roomId: room.roomId, partner: room.partner })
                        )
                    }
                    className="flex space-x-2 w-full items-center justify-end "
                >
                    <div>{partner.displayName}</div>
                    <div
                        className={`${
                            unreadChat.length > 0 ? `bg-red-100` : `bg-gray-200`
                        } w-1/12 rounded-md px-3 flex items-center justify-center`}
                    >
                        <div>{unreadChat.length}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
