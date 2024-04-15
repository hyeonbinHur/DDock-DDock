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
import defaultImg from '../../assets/defaultImg.png';
import ImgMessageModal from '../Modal/ImgMessgeModal';

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
    const modal = useRef();

    const [imageUpload, setImageUpload] = useState(undefined); //업로드된 이미지들
    const [imagePreview, setImagePreview] = useState(undefined); //선택한 이미지 미리보기
    const fileInputRef = useRef();

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
            console.log('들어옴');
            tryToReadMessaged();
        } else if (!isPageFocused) {
            console.log('포커스 해제');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPageFocused]);

    useEffect(() => {
        if (imagePreview !== undefined) {
            console.log('열려라 참깨');
            openImageSendModal();
        }
    }, [imagePreview]);

    const tryToReadMessaged = async () => {
        await readChat('User', roomId, user?.uid);
    };

    const handleSubmit = async () => {
        setContent('');
        const createdAt = formatDate(timestamp.fromDate(new Date()));
        // const createdAt = "18/04/2024, 24:57:47";
        const uuid = uuidv4();
        const [datePart, timePart] = createdAt.split(', ');
        // eslint-disable-next-line no-unused-vars
        const [day, month, year] = datePart.split('/').map(Number);
        // eslint-disable-next-line no-unused-vars
        const [hour, minute, second] = timePart.split(':').map(Number);

        if (year != lastYear || month != lastMonth || day != lastDay) {
            console.log('GM message');
            const GMmessage = {
                content: null,
                sender: 'GM',
                createdAt: createdAt,
            };
            setCurrentChat((state) => [...state, GMmessage]);
            await updateChat(
                'ChattingRoom',
                roomId,
                GMmessage,
                partnerId,
                'GM'
            );
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
            await updateChat(
                'ChattingRoom',
                roomId,
                newMessage,
                partnerId,
                currentUser.id
            );
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
            await updateChat(
                'ChattingRoom',
                roomId,
                newMessage,
                partnerId,
                currentUser.id
            );
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
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImageUpload(file);
        console.log(file);
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result); // 이 결과를 `src`로 사용하여 이미지 미리보기를 보여줍니다.
            };
            reader.readAsDataURL(file);
        }
    };

    function openImageSendModal() {
        modal.current.open();
    }

    return (
        <>
            <div className={style.container}>
                {user && currentUser && (
                    <>
                        <ImgMessageModal ref={modal} preview={undefined} />

                        <div className={style.chat_header}>
                            {partner && <div> {partner.displayName}</div>}
                            <button onClick={closeChatRoom}>X</button>
                        </div>
                        <div>
                            {chatRoom?.chat.length > 0 &&
                                currentChat.length > 0 &&
                                currentChat.map((chat, index) => (
                                    <ul key={index} className={style.chatItem}>
                                        {chat.sender === currentUser.id && (
                                            <CurrentUserChat
                                                key={chat.id}
                                                chat={chat}
                                                partner={partner}
                                                roomId={roomId}
                                            />
                                        )}
                                        {chat.sender === partnerId && (
                                            <PartnerUserChat
                                                key={index}
                                                avatar={partner.avatar}
                                                displayName={
                                                    partner.displayName
                                                }
                                                roomId={roomId}
                                                chat={chat}
                                                user={currentUser}
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
                            <input
                                type="file"
                                className={style.fileInput}
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />
                            <div>
                                <img
                                    src={defaultImg}
                                    className={style.defaultImg}
                                    onClick={handleImageClick}
                                />
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
                            </div>

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
