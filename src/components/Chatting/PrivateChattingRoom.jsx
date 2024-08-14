import { AiOutlineClose } from 'react-icons/ai';
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
    const { updateChat, readChat, startChat } = useFirestore('ChattingRoom');
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
    const [imageUrl, setImageUrl] = useState(undefined);
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
            tryToReadMessaged();
        } else if (!isPageFocused) {
            console.log('포커스 해제');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPageFocused]);

    useEffect(() => {
        if (imagePreview !== undefined) {
            openImageSendModal();
        }
    }, [imagePreview]);

    useEffect(() => {
        if (imageUrl !== undefined) {
            openImageSendModal();
        }
    }, [imageUrl]);

    const doAction = (action) => {
        if (action === 'close') {
            setImagePreview(undefined);
            setImageUpload(undefined);
        }
    };

    const receiveURL = async (URL) => {
        setImageUrl(undefined);
        const createdAt = formatDate(timestamp.fromDate(new Date()));
        await sendMessage(createdAt, URL, 'img');
    };

    const tryToReadMessaged = async () => {
        await readChat('User', roomId, user?.uid);
    };

    const sendMessage = async (createdAt, content, type, getRoomID) => {
        const roomID = getRoomID ? getRoomID : roomId;

        const uuid = uuidv4();
        const [datePart, timePart] = createdAt.split(', ');
        // eslint-disable-next-line no-unused-vars
        const [day, month, year] = datePart.split('/').map(Number);
        // eslint-disable-next-line no-unused-vars
        const [hour, minute, second] = timePart.split(':').map(Number);

        if (currentChat.length === 0) {
            await startChat(roomId, currentUser.id, partnerId);
        }
        if (year != lastYear || month != lastMonth || day != lastDay) {
            const GMmessage = {
                content: null,
                sender: 'GM',
                createdAt: createdAt,
                type: 'txt',
            };
            setCurrentChat((state) => [...state, GMmessage]);
            await updateChat(
                'ChattingRoom',
                roomID,
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
                type: type,
            };
            setCurrentChat((state) => [...state, newMessage]);
            await updateChat(
                'ChattingRoom',
                roomID,
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
                type: type,
            };
            setCurrentChat((state) => [...state, newMessage]);
            await updateChat(
                'ChattingRoom',
                roomID,
                newMessage,
                partnerId,
                currentUser.id
            );
        }
    };

    const handleSubmit = async () => {
        if (content.length == 0) return;
        setContent('');
        const createdAt = formatDate(timestamp.fromDate(new Date()));
        // const createdAt = "18/04/2024, 24:57:47";
        await sendMessage(createdAt, content, 'txt');
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
        <div className="h-full overflow-hidden">
            {user && currentUser && (
                <div className="h-[90%] relative ">
                    {/* <div className="border border-separate mx-2"></div> */}
                    {/* chat content */}
                    <div className="flex justify-between items-center rounded-t-md border-t font-bold px-4 pb-2 mb-2 sticky top-0 z-10 w-full bg-white">
                        {partner && <div> {partner.displayName}</div>}
                        <p
                            className="p-1 hover:scale-110 hover:bg-gray-200 rounded-md"
                            onClick={closeChatRoom}
                        >
                            <AiOutlineClose className="size-6" />
                        </p>
                    </div>

                    <div className="lg:h-[58%] h-[75%] overflow-auto">
                        {chatRoom?.chat.length > 0 &&
                            currentChat.length > 0 &&
                            currentChat.map((chat, index) => (
                                <ul key={index} className="max-h-80">
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
                                            displayName={partner.displayName}
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

                        <div ref={scrollDown}></div>
                    </div>
                    <div className="w-full sticky bottom-2">
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                        <div className="mt-8 p-3 h-32">
                            <div className="bg-white">
                                <textarea
                                    className="w-full h-24 p-1 outline-none"
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
                                <div className="flex justify-between px-3">
                                    <img
                                        src={defaultImg}
                                        className="w-10 "
                                        onClick={handleImageClick}
                                    />

                                    <button
                                        onClick={handleSubmit}
                                        className={`border px-2 rounded-md  ${
                                            content.length > 0
                                                ? `bg-sky-300 hover:scale-105`
                                                : `bg-gray-100`
                                        }`}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>

                        <ImgMessageModal
                            ref={modal}
                            preview={imagePreview}
                            uploadImg={imageUpload}
                            roomId={roomId}
                            myId={currentUser.id}
                            doAction={doAction}
                            sendURL={receiveURL}
                        />
                    </div>

                    {/* text area */}
                </div>
            )}
        </div>
    );
}
