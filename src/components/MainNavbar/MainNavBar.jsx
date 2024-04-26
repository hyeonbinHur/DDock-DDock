import { NavLink } from 'react-router-dom';
import style from './MainNavBar.module.css';
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import ChattingRoomList from '../Chatting/ChattingRoomList';
import { useDocument } from '../../hooks/useDocument';
import { useSelector } from 'react-redux';
import PrivateChattingRoom from '../Chatting/PrivateChattingRoom';
import toast, { Toaster } from 'react-hot-toast';
import { projectFirestore } from '../../firebase/config';
import { useQuery } from '@tanstack/react-query';
import { getDocument } from '../../api/getDocument';
import logo from '../../assets/logo/logo.png';
import earth from '../../assets/vector/earth.png';
import menu from '../../assets/vector/menu.png';

const receiveDynamycUserInfo = async (id) => {
    const ref = projectFirestore.collection('User').doc(id);
    const senderRef = await ref.get();
    const senderData = senderRef.data();
    return senderData;
};

export default function Navbar() {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const [showChatList, setShowChatList] = useState(false);
    const [showMenu, isShowMenu] = useState(false);
    const { document: currentUser } = useDocument('User', user?.uid);

    const openChatRoom = useSelector(
        (state) => state.openChatRoom.openChatRoom
    );

    const [oldUser, setOldUser] = useState(currentUser?.unread);

    const { data } = useQuery({
        queryKey: ['User', user?.uid],
        queryFn: () => getDocument('User', user?.uid),
        enabled: !!user?.uid, // user?.uid가 존재할 때만 쿼리 실행
        cacheTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
        staleTime: 1000 * 60,
    });

    const activeChatList = () => {
        setShowChatList(!showChatList);
    };

    useEffect(() => {
        // 올드 유저를 저장하고, 올드유저 unread값이랑 현 업데이트된 unread값이 다르면 토스트
        if (oldUser) {
            if (oldUser) {
                if (oldUser.length === currentUser.unread.length) {
                    oldUser.forEach((chat) => {
                        currentUser.unread.some((real) => {
                            if (chat.roomId == real.roomId) {
                                if (chat.chat.length < real.chat.length) {
                                    const type =
                                        real.chat[real.chat.length - 1].type;
                                    receiveMessageFromOldRoom(
                                        real.chat[real.chat.length - 1],
                                        type,
                                        real.sender
                                    );
                                }
                            }
                        });
                    });
                } else if (oldUser.length !== currentUser.unread.length) {
                    const type =
                        currentUser.unread[currentUser.unread.length - 1]
                            .chat[0].type;
                    console.log(
                        currentUser.unread[currentUser.unread.length - 1]
                            .chat[0]
                    );
                    console.log(
                        currentUser.unread[currentUser.unread.length - 1]
                            .chat[0].content
                    );

                    receiveMessageFromNewRoom(
                        currentUser.unread[currentUser.unread.length - 1]
                            .chat[0],
                        type,
                        currentUser.unread[currentUser.unread.length - 1].sender
                    );
                }
            }
        }
        setOldUser(currentUser?.unread);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.unread]);

    const notify = (sender, content, type) => {
        if (type === 'txt') {
            toast(sender + '님이 메세지를 보냈어요 : ' + content);
        } else if (type === 'img') {
            toast(sender + '님이 이미지를 보냈어요');
        }
    };

    const receiveMessageFromOldRoom = async (content, type, sender) => {
        const senderInfo = await receiveDynamycUserInfo(sender);
        notify(senderInfo.displayName, content.content, type);
    };

    const receiveMessageFromNewRoom = async (content, type, sender) => {
        const senderInfo = await receiveDynamycUserInfo(sender);
        notify(senderInfo.displayName, content.content, type);
    };

    return (
        <div className="fixed h-24 w-full bg-blue-50 z-10">
            <nav>
                <ul className="flex ml-44 pt-5">
                    <li>
                        <NavLink to="/">
                            <img src={logo} className="w-32 h-15 mr-20" />
                        </NavLink>
                    </li>
                    <div className="flex pt-1.5">
                        <li>
                            <NavLink to="/market" className="mr-20 text-2xl">
                                {' '}
                                Market{' '}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/job" className="mr-20 text-2xl">
                                Job{' '}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/house" className="mr-20 text-2xl">
                                House{' '}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/community" className="mr-10 text-2xl">
                                Community{' '}
                            </NavLink>
                        </li>
                        {/* <li>
                            <NavLink to="/csstest" className="mr-10 text-2xl">
                                memo{' '}
                            </NavLink>
                        </li> */}
                        <div className="flex ml-96 pl-20">
                            <li>
                                <img src={earth} className="w-8 mr-10" />
                            </li>
                            <div>
                                <button
                                    onClick={() => isShowMenu((prev) => !prev)}
                                >
                                    <img src={menu} className="w-8 pb-5" />
                                </button>
                            </div>
                        </div>
                        {showMenu && (
                            <div className="bg-blue-50 z-11 w-40 absolute flex flex-col border-4 border-white top-24 right-72 items-center p-2 rounded-2xl justify-between">
                                {!user && (
                                    <>
                                        <div className="w-full items-center font-bold">
                                            <NavLink to="/login">Login</NavLink>
                                        </div>
                                        <div>
                                            <NavLink to="/signup">
                                                Signup
                                            </NavLink>
                                        </div>
                                    </>
                                )}

                                {user && (
                                    <>
                                        <div className="font-bold mb-2 hover:bg-white rounded-lg cursor-pointer w-full flex flex-col items-center align-middle">
                                            <div
                                                className="btn p-3"
                                                onClick={logout}
                                            >
                                                Logout
                                            </div>
                                        </div>
                                        <div className='w-full border-2 border-white'></div>
                                        <div className="font-bold mb-2 mt-2 hover:bg-white rounded-lg cursor-pointer w-full flex flex-col items-center align-middle">
                                            <NavLink
                                                className="p-3"
                                                to={`/profile/${user.uid}`}
                                            >
                                                Profile
                                            </NavLink>
                                        </div>
                                        <div className='w-full border-2 border-white'></div>

                                        <div className="font-bold mb-2 mt-2 hover:bg-white rounded-lg cursor-pointer w-full flex flex-col items-center align-middle">
                                            <button
                                                onClick={activeChatList}
                                                className="p-3"
                                            >
                                                채팅
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </ul>
            </nav>
            {showChatList && (
                <div className={style.popupContainer}>
                    <ChattingRoomList
                        chatRoom={data.chatRoom}
                        userId={data.id}
                    />
                </div>
            )}
            {openChatRoom && (
                <div className={style.ChatpopupContainer}>
                    <PrivateChattingRoom />
                </div>
            )}

            <div>
                <Toaster />
            </div>
        </div>
    );
}
