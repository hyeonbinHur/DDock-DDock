import style from './PrivateChattingRoom.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { close } from '../../store/chatRoomSlice';
import { useDocument } from '../../hooks/useDocument';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuth';
import { useEffect, useState, useRef } from 'react';
import CurrentUserChat from './CurrentUserChat';
import PartnerUserChat from './PartnerUserChat';
import { timestamp } from '../../firebase/config';
import ChatDate from './Chatdate';
import { v4 as uuidv4 } from 'uuid';

export default function PrivateChattingRoom() {
    const dispatch = useDispatch();
    const roomId = useSelector((state) => state.openChatRoom.roomId);
    const partnerId = useSelector((state) => state.openChatRoom.partnerId);

    const { updateChat, readChat } = useFirestore('ChattingRoom');

    const { user } = useAuthContext();
    const [content, setContent] = useState('');
    const { document: currentUser } = useDocument('User', user?.uid);
    const { document: partner } = useDocument('User', partnerId);
    const { document: chatRoom } = useDocument('ChattingRoom', roomId);
    const scrollDown = useRef(null);

    const [currentChat, setCurrentChat] = useState([]);
    const [lastYear, setLastYear] = useState(null);
    const [lastMonth, setLastMonth] = useState(null);
    const [lastDay, setLastDay] = useState(null);
    const [lastHour, setLastHour] = useState(null);
    const [lastMinute, setLastMinute] = useState(null);

    const scrollDownFn = () => {
        scrollDown.current?.scrollIntoView({ behavior: 'auto' });
    };
    const [isPageFocused, setIsPageFocused] = useState(true);

    useEffect(() => {
        const handleFocus = () => {
            setIsPageFocused(true); // 페이지가 포커스 되었을 때
        };

        const handleBlur = () => {
            setIsPageFocused(false); // 페이지가 포커스를 잃었을 때
        };

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    useEffect(() => {
        scrollDownFn();
        if (currentChat.length > 1) {
            const lastMessageTimeInfo =
                currentChat[currentChat.length - 1].createdAt;
            const [datePart, timePart] = lastMessageTimeInfo.split(', ');
            // eslint-disable-next-line no-unused-vars
            const [day, month, year] = datePart.split('/').map(Number);
            // eslint-disable-next-line no-unused-vars
            const [hour, minute, second] = timePart.split(':').map(Number);
            setLastYear(year);
            setLastMonth(month);
            setLastDay(day);
            setLastHour(hour);
            setLastMinute(minute);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat]);

    useEffect(() => {
        if (chatRoom) {
            setCurrentChat(chatRoom.chat);
        }
    }, [chatRoom]);

    useEffect(() => {
        if (isPageFocused) {
            tryToReadMessaged();
        } else if (!isPageFocused) {
            console.log('포커스 해제');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPageFocused]);

    const tryToReadMessaged = async () => {
        await readChat('ChattingRoom', roomId, partnerId);
    };

    const handleSubmit = async () => {
        setContent('');
        const createdAt = formatDate(timestamp.fromDate(new Date()));
        const uuid = uuidv4();
        const [datePart, timePart] = createdAt.split(', ');
        // eslint-disable-next-line no-unused-vars
        const [day, month, year] = datePart.split('/').map(Number);
        // eslint-disable-next-line no-unused-vars
        const [hour, minute, second] = timePart.split(':').map(Number);
        console.log("last year" + lastYear);
        console.log("year " + year);

        if (year != lastYear || month != lastMonth || day != lastDay) {
            console.log("GM message");
            const GMmessage = {
                content: null,
                sender: 'GM',
                createdAt: createdAt,
            };
            setCurrentChat((state) => [...state, GMmessage]);
            await updateChat('ChattingRoom', roomId, GMmessage, partnerId ,"GM");
        }
        if (
            month != lastMonth ||
            day != lastDay ||
            hour != lastHour ||
            minute != lastMinute ||
            currentChat[currentChat.length - 1].sender != user.uid
        ) {
            const newMessage = {
                id: uuid,
                content: content,
                sender: user?.uid,
                createdAt: createdAt,
                showBasicInfo: true,
            };
            setCurrentChat((state) => [...state, newMessage]);
            await updateChat('ChattingRoom', roomId, newMessage, partnerId, currentUser.id );
        } else if (
            month == lastMonth &&
            day == lastDay &&
            hour == lastHour &&
            minute == lastMinute
        ) {
            const newMessage = {
                id: uuid,
                content: content,
                sender: user?.uid,
                createdAt: createdAt,
                showBasicInfo: false,
            };
            setCurrentChat((state) => [...state, newMessage]);
            await updateChat('ChattingRoom', roomId, newMessage, partnerId, currentUser.id );
        }
    };

    function formatDate(timestamp) {
        return new Date(timestamp.seconds * 1000).toLocaleString('en-AU', {
            timeZone: 'Australia/Sydney',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    }

    const closeChatRoom = () => {
        setIsPageFocused(false);
        dispatch(close());
    };

    return (
        <>
            <div className={style.container}>
                {user && (
                    <>
                        <div className={style.chat_header}>
                            {partner && <div> {partner.displayName}</div>}
                            <button onClick={closeChatRoom}>X</button>
                        </div>
                        <div>
                            {chatRoom?.chat.length > 0 &&
                                currentChat.length > 0 &&
                                currentChat.map((chat, index) => (
                                    <ul key={index} className={style.chatItem}>
                                        {chat.sender === currentUser.id &&
                                            (
                                                <CurrentUserChat
                                                    key={chat.id}
                                                    content={chat.content}
                                                    date={chat.createdAt}
                                                    showBasicInfo={
                                                        chat.showBasicInfo
                                                    }
                                                    user = {user.uid}
                                                    roomId={roomId}
                                                    chatId={chat.id}
                                                   
                                                />
                                            )}
                                        {chat.sender !== currentUser.id &&
                                            chat.sender !== 'GM' && (
                                                <PartnerUserChat
                                                    key={index}
                                                    content={chat.content}
                                                    avatar={partner.avatar}
                                                    date={chat.createdAt}
                                                    showBasicInfo={
                                                        chat.showBasicInfo
                                                    }
                                                    displayName={
                                                        partner.displayName
                                                    }
                                                    user = {user.uid}
                                                    roomId={roomId}
                                                    chatId={chat.id}
                                                />
                                            )}
                                        {chat.sender == 'GM' && (
                                            <ChatDate date={chat.createdAt} />
                                        )}
                                    </ul>
                                ))}
                        </div>
                        <div ref={scrollDown}></div>

                        <div className={style.chat_textfield}>
                            <textarea
                                type="text"
                                value={content}
                                onChange={(event) => {
                                    setContent(event.target.value);
                                }}
                                onKeyDown={(event) => {
                                    if (
                                        event.key === 'Enter' &&
                                        !event.shiftKey
                                    ) {
                                        if (content.length > 0) {
                                            event.preventDefault(); // 텍스트 영역에서 엔터키로 인한 줄바꿈 방지
                                            handleSubmit();
                                        }
                                        if (content.length == 0) {
                                            event.preventDefault();
                                        }
                                    }
                                }}
                            ></textarea>
                            {content.length > 0 && (
                                <button onClick={handleSubmit}>send</button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
