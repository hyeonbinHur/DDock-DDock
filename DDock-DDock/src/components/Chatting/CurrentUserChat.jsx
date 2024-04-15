import { useEffect, useState } from 'react';
import style from './UserChat.module.css';
import { useDocument } from '../../hooks/useDocument';
export default function CurrentUserChat({
    chat,
    partner,
    roomId
}) {
    const [datePart, timePart] = chat.createdAt.split(', ');
    // eslint-disable-next-line no-unused-vars
    const [day, month, year] = datePart.split('/').map(Number);
    // eslint-disable-next-line no-unused-vars
    const [hour, minute, second] = timePart.split(':').map(Number);

    const [cssStyle, setCssSytle] = useState(style.current_chat_container);

    const [read, setRead] = useState(false);

    const { document: chatRoom } = useDocument('ChattingRoom', roomId);
    const { document: partnerInfo } = useDocument('User', partner.id);


    useEffect(() => {
        console.log("이펙트 들어옴")
        if(chatRoom && partnerInfo?.unread){
            if(partnerInfo.unread.some((room) => room.roomId === chatRoom.id)){

                partnerInfo.unread.map((room) =>{
                    if(room.roomId === chatRoom.roomId){
                        console.log("같은 룸 찾음")
                        room.chat.map((userUnreadChat) => {
                            if(userUnreadChat.id == chat.id ){
                                console.log("같은 챗 찾음")
                                setRead(true);
                            }
                        })
                        
                    }
                });
               
            }
        }
    }, [chat.id, chatRoom, partnerInfo?.unread]);

    useEffect(() => {
        if (chat.showBasicInfo === false) {
            setCssSytle(style.current_chat_container_without_info);
        } else {
            setCssSytle(style.current_chat_container);
        }
    }, [chat.showBasicInfo]);

    return (
        <div className={cssStyle}>
            {chat.showBasicInfo && (
                <span className={style.current_timeContainer}>
                     {hour === 24 ? '00' : String(hour).padStart(2, '0')} :
                    {String(minute).padStart(2, '0')}
                </span>
            )}
            {!read && <span>1</span>}
            <span className={style.current_chat_content}>{chat.content}</span>
        </div>
    );
}
