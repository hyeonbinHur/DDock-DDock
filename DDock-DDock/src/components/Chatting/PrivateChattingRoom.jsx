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

export default function PrivateChattingRoom() {
    const dispatch = useDispatch();
    const roomId = useSelector((state) => state.openChatRoom.roomId);
    const partnerId = useSelector((state) => state.openChatRoom.partnerId);
    const { updateChat } = useFirestore('ChaattingRoom');
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
    }, [currentChat]);

    useEffect(() => {
        if (chatRoom) {
            setCurrentChat(chatRoom.chat);
        }
    }, [chatRoom]);

    const handleSubmit = async () => {
        setContent('');
        const createdAt = formatDate(timestamp.fromDate(new Date()));

        const [datePart, timePart] = createdAt.split(', ');
        // eslint-disable-next-line no-unused-vars
        const [day, month, year] = datePart.split('/').map(Number);
        // eslint-disable-next-line no-unused-vars
        const [hour, minute, second] = timePart.split(':').map(Number);

        if (year != lastYear || month != lastMonth || day != lastDay) {
            const GMmessage = {
                content: null,
                sender: 'GM',
                createdAt: createdAt,
            };
            setCurrentChat((state) => [...state, GMmessage]);
            await updateChat('ChattingRoom', roomId, GMmessage);
        }

        if (
            month != lastMonth ||
            day != lastDay ||
            hour != lastHour ||
            minute != lastMinute ||
            currentChat[currentChat.length - 1].sender != user.uid
        ) {
            const newMessage = {
                content: content,
                sender: user?.uid,
                createdAt: createdAt,
                showBasicInfo: true,
            };
            setCurrentChat((state) => [...state, newMessage]);
            await updateChat('ChattingRoom', roomId, newMessage);
        } else if (
            month == lastMonth &&
            day == lastDay &&
            hour == lastHour &&
            minute == lastMinute
        ) {
            const newMessage = {
                content: content,
                sender: user?.uid,
                createdAt: createdAt,
                showBasicInfo: false,
            };
            setCurrentChat((state) => [...state, newMessage]);
            await updateChat('ChattingRoom', roomId, newMessage);
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

    return (
        <>
            <div className={style.container}>
                {user && (
                    <>
                        <div className={style.chat_header}>
                            {partner && <div> {partner.displayName}</div>}
                            <button onClick={() => dispatch(close())}>X</button>
                        </div>
                        <div>
                            {chatRoom?.chat.length > 0 &&
                                currentChat.length > 0 &&
                                currentChat.map((chat, index) => (
                                    <ul key={index} className={style.chatItem}>
                                        {chat.sender === currentUser.id && (
                                            <CurrentUserChat
                                                key={chat.id}
                                                content={chat.content}
                                                date={chat.createdAt}
                                                showBasicInfo={
                                                    chat.showBasicInfo
                                                }
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
