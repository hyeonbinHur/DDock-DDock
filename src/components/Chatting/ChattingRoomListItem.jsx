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
            currentUser.unread.forEach((unreadRoom) =>{
                if(unreadRoom.roomId === room.roomId){
                    setUnreadChat(unreadRoom.chat);
                }
            })
        }
    }, [room.roomId, currentUser, currentUser?.unread]);

    const dispatch = useDispatch();

    return (
        <div>
            {partner && currentUser && (
                <p
                    onClick={() =>
                        dispatch(
                            open({ roomId: room.roomId, partner: room.partner })
                        )
                    }
                >
                    {partner.displayName} {unreadChat.length}
                </p>
            )}
        </div>
    );
}
