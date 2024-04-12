import style from './PrivateChattingRoom.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { close } from '../../store/chatRoomSlice';
import { useDocument } from '../../hooks/useDocument';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuth';
import { useEffect, useState, useRef } from 'react';
import CurrentUserChat from './CurrentUserChat';
import PartnerUserChat from './PartnerUserChat';
import { v4 as uuidv4 } from 'uuid';
import { timestamp } from '../../firebase/config';

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
    const [currentChat, setCurrentChat] = useState([]);
    const scrollDown = useRef(null);

    const scrollDownFn = () => {
        scrollDown.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollDownFn();
    }, [currentChat]);

    useEffect(() => {
        if (chatRoom) {
            setCurrentChat(chatRoom.chat);
        }
    }, [chatRoom]);

    const handleSubmit = async () => {
        setContent('');
        const uuid = uuidv4();
        const createdAt = timestamp.fromDate(new Date());
        const newMessage = {
            content: content,
            sender: user?.uid,
            createdAt: createdAt,
            id: uuid,
        };
        
        setCurrentChat((state) => [...state, newMessage]);
        await updateChat(content, user.uid, 'ChattingRoom', roomId, uuid);
    };

    return (
        <>
            <div className={style.container}>
                {user && (
                    <>
                        <div className={style.chat_header}>
                            {partner && <div> {partner.displayName}</div>}
                            <button onClick={() => dispatch(close())}>X</button>
                        </div>
                        <div >
                            {chatRoom?.chat.length > 0 &&
                                currentChat.length > 0 &&
                                currentChat.map((chat) => (
                                    <ul
                                        key={chat.id}
                                        className={style.chatItem}
                                    >
                                        {chat.sender === currentUser.id && (
                                            <CurrentUserChat
                                                key={chat.id}
                                                content={chat.content}
                                                date ={chat.createdAt}
                                                
                                            />
                                        )}

                                        {chat.sender !== currentUser.id && (
                                            <PartnerUserChat
                                                key={chat.id}
                                                content={chat.content}
                                                avatar={partner.avatar}
                                                date ={chat.createdAt}
                                                displayName={
                                                    partner.displayName
                                                }
                                            />
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
