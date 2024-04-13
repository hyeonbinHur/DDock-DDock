import { useDocument } from '../../hooks/useDocument';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { open } from '../../store/chatRoomSlice';

export default function ChattingRoomListItem({ room }) {
    const { document: partner } = useDocument('User', room.partner);
    const { document: chatRoom } = useDocument('ChattingRoom', room.roomId);
    const [unreadChat, setUnreadChat] = useState([]);

    useEffect(() => {
        if(chatRoom){
            const emptyArray = []
            setUnreadChat(emptyArray)
            chatRoom.chat.map((chat) => {
                if(chat.sender == room.partner){
                    if(chat.status === 'unread'){
                        setUnreadChat((prevState) => [...prevState, chat])
                    }
                }
            })
        }
    },[chatRoom, room.partner])

    const dispatch = useDispatch();

    return (
        <div>
            {partner && chatRoom && (
                <p
                    onClick={() =>
                        dispatch(
                            open({ roomId: room.roomId, partner: room.partner })
                        )
                    }
                >
                    {partner.displayName}  {unreadChat.length}
                    
                </p>
            )}

        </div>
    );
}
