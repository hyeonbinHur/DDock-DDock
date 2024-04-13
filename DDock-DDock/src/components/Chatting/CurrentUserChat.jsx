import { useEffect, useState } from 'react';
import style from './UserChat.module.css';
import { useDocument } from '../../hooks/useDocument';
export default function CurrentUserChat({
    content,
    date,
    showBasicInfo,
    user,
    roomId,
    chatId,
}) {
    const [datePart, timePart] = date.split(', ');
    // eslint-disable-next-line no-unused-vars
    const [day, month, year] = datePart.split('/').map(Number);
    // eslint-disable-next-line no-unused-vars
    const [hour, minute, second] = timePart.split(':').map(Number);

    const [cssStyle, setCssSytle] = useState(style.current_chat_container);

    const [read, setRead] = useState(false);

    const { document: chatRoom } = useDocument('ChattingRoom', roomId);

    useEffect(() => {
        if (chatRoom) {
            if (chatRoom.user1 === user) {
                if (chatRoom.user2_unread.some((chat) => chat.id === chatId)) {
                    setRead(false);
                } else if (
                    !chatRoom.user2_unread.some((chat) => chat.id === chatId)
                ) {
                    setRead(true);
                }
            } else if (chatRoom.user2 === user) {
                if (chatRoom.user1_unread.some((chat) => chat.id === chatId)) {
                    setRead(false);
                } else if (
                    !chatRoom.user1_unread.some((chat) => chat.id === chatId)
                ) {
                    setRead(true);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatRoom]);

    useEffect(() => {
        if (showBasicInfo === false) {
            setCssSytle(style.current_chat_container_without_info);
        } else {
            setCssSytle(style.current_chat_container);
        }
    }, [showBasicInfo]);

    return (
        <div className={cssStyle}>
            {showBasicInfo && (
                <span className={style.current_timeContainer}>
                    {hour} : {minute}
                </span>
            )}
            {!read && <span>1</span>}
            <span className={style.current_chat_content}>{content}</span>
        </div>
    );
}
