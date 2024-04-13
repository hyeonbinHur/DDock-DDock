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
            if(chatRoom.user1 == room.partner){
                chatRoom.user2_unread.map((unreadChat)=>{
                    setUnreadChat((prevState) => [...prevState, unreadChat])
                })

            }else if(chatRoom.user2 == room.partner){
                chatRoom.user1_unread.map((unreadChat)=>{
                    setUnreadChat((prevState) => [...prevState, unreadChat])
                })
                
            }
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
