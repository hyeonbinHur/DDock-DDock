import defaultUserImg from '../../assets/user.png';
import style from './UserChat.module.css';
import { useEffect, useState } from 'react';
import { useDocument } from '../../hooks/useDocument';

export default function PartnerUserChat({
    // content,
    // avatar,
    // displayName,
    // date,
    // showBasicInfo,
    // user,
    // roomId,
    // chatId,

    avatar,
    displayName,
    roomId,
    chat,
    user,
}) {
    const [datePart, timePart] = chat.createdAt.split(', ');
    // eslint-disable-next-line no-unused-vars
    const [day, month, year] = datePart.split('/').map(Number);
    // eslint-disable-next-line no-unused-vars
    const [hour, minute, second] = timePart.split(':').map(Number);

    const [cssStyle, setCssSytle] = useState(style.partner_chat_container);

    const [read, setRead] = useState(false);

    const { document: chatRoom } = useDocument('ChattingRoom', roomId);
    const { document: currentUser } = useDocument('User', user.id);


    // useEffect(() => {
    //     if (chatRoom) {
    //         if (chatRoom.user1 === user) {
    //             if (chatRoom.user1_unread.some((chat) => chat.id === chatId)) {
    //                 setRead(false);
    //             } else if (
    //                 !chatRoom.user1_unread.some((chat) => chat.id === chatId)
    //             ) {
    //                 setRead(true);
    //             }
    //         } else if (chatRoom.user2 === user) {
    //             ``;
    //             if (chatRoom.user2_unread.some((chat) => chat.id === chatId)) {
    //                 setRead(false);
    //             } else if (
    //                 !chatRoom.user2_unread.some((chat) => chat.id === chatId)
    //             ) {
    //                 setRead(true);
    //             }
    //         }
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [chatRoom]);

    
    useEffect(() => {
        if (chatRoom && currentUser?.unread) {
            if (
                currentUser.unread.some((room) => room.roomId === chatRoom.id)
            ) {
                currentUser.unread.map((room) => {
                    if (room.roomId === chatRoom.id) {
                        if (
                            room.chat.map(
                                (userUnreadChat) => userUnreadChat.id == chat.id
                            )
                        ) {
                            setRead(false);
                        } else {
                            setRead(true);
                        }
                    }
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatRoom, currentUser?.unread]);


    useEffect(() => {
        if (chat.showBasicInfo === false) {
            setCssSytle(style.partner_chat_container);
        } else {
            setCssSytle(style.partner_chat_container);
        }
    }, [chat.showBasicInfo]);

    return (
        <div className={cssStyle}>
            {chat.showBasicInfo && (
                <div className={style.partner_chat_info}>
                    <img
                        className={style.partner_chat_avatar}
                        src={avatar || defaultUserImg}
                    />
                    <div>
                        <span className={style.partner_chat_displayName}>
                            {displayName}
                        </span>
                    </div>
                </div>
            )}

            <div>
                <span className={style.partner_chat_content}>{chat.content}</span>
                {!read && <span>1</span>}
                {chat.showBasicInfo && (
                    <span className={style.partner_timeContainer}>
                        {String(hour).padStart(2, '0')} : {String(minute).padStart(2, '0')}
                    </span>
                )}
            </div>
        </div>
    );
}
