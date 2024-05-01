import { BsChatHeart } from 'react-icons/bs';
import { SlMenu } from 'react-icons/sl';
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
    const [mobileMenu, setMobileMenu] = useState(false);
    const [isPageClick, setIsPageClick] = useState(false);
    const [isProfile, setIsProfile] = useState(false);
    const [isLanguage, setIsLanguage] = useState(false);

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
        setMobileMenu(false);
        isShowMenu(false);
    };

    const closeMenu = () => {
        setMobileMenu(false);
        isShowMenu(false);
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

    const clickPage = () => {
        setIsPageClick(!isPageClick);
        setIsProfile(false);
        setIsLanguage(false);
    };
    const clickProfile = () => {
        setIsPageClick(false);
        setIsProfile(!isProfile);
        setIsLanguage(false);
    };
    const clickLanguage = () => {
        setIsPageClick(false);
        setIsProfile(false);
        setIsLanguage(!isLanguage);
    };

    const closeChatRoomList = () => {
        setShowChatList(false);
    };

    return (
        <div>
            <div className="fixed h-24 w-full bg-blue-50 z-20 p-7">
                <nav className="flex items-center justify-between ">
                    <div>
                        <NavLink to="/">
                            <img src={logo} className="w-20" />
                        </NavLink>
                    </div>
                    <ul className="hidden lg:flex space-x-3 ">
                        <div className="flex space-x-10 text-lg">
                            <li>
                                <NavLink
                                    to="/market"
                                    className=""
                                    onClick={() => closeMenu()}
                                >
                                    {' '}
                                    Market
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/job"
                                    className=" "
                                    onClick={() => closeMenu()}
                                >
                                    Job{' '}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/house"
                                    className=""
                                    onClick={() => closeMenu()}
                                >
                                    House{' '}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/community"
                                    className=""
                                    onClick={() => closeMenu()}
                                >
                                    Community{' '}
                                </NavLink>
                            </li>
                            {/* <li>
                            <NavLink to="/csstest" className="mr-10 text-2xl">
                                memo{' '}
                            </NavLink>
                        </li> */}
                        </div>
                    </ul>
                    <div className=" space-x-5 hidden lg:flex">
                        <div>
                            <img src={earth} className="w-8" />
                        </div>
                        <div>
                            <button onClick={() => isShowMenu((prev) => !prev)}>
                                <img src={menu} className="w-8" />
                            </button>
                        </div>
                    </div>
                    <div
                        onClick={() => setMobileMenu((prev) => !prev)}
                        className="hover:bg-gray-200 hover:border hover:border-gray-300 rounded-xl p-2 lg:hidden"
                    >
                        <SlMenu />
                    </div>

                    {showMenu && (
                        <div className="hidden bg-blue-50 z-20 w-40 absolute lg:flex flex-col border-4 border-white top-[100%] right-[5%] items-center p-2 rounded-2xl justify-between">
                            {!user && (
                                <>
                                    <div className="w-full items-center font-bold">
                                        <NavLink to="/login">Login</NavLink>
                                    </div>
                                    <div>
                                        <NavLink to="/signup">Signup</NavLink>
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
                                    <div className="w-full border-2 border-white"></div>
                                    <div className="font-bold mb-2 mt-2 hover:bg-white rounded-lg cursor-pointer w-full flex flex-col items-center align-middle">
                                        <NavLink
                                            className="p-3"
                                            to={`/profile/${user.uid}`}
                                        >
                                            Profile
                                        </NavLink>
                                    </div>
                                    <div className="w-full border-2 border-white"></div>

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
                </nav>
                {showChatList && (
                    <div className="w-full  z-10 absolute top-[90%] left-[47%]">
                        <ChattingRoomList
                            chatRoom={data.chatRoom}
                            userId={data.id}
                            closeChatRoom={closeChatRoomList}
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
            {mobileMenu && (
                <div className="absolute top-[10%] z-30 w-full border-2 rounded-lg border-white p-2 bg-blue-50 lg:hidden">
                    <div className="space-y-3 p-3">
                        <div
                            onClick={clickPage}
                            className="hover:bg-white p-3 w-full rounded-lg font-bold text-xl"
                        >
                            page
                        </div>
                        {isPageClick && (
                            <>
                                {' '}
                                <div className="border border-white"> </div>
                                <div className="px-7 space-y-3">
                                    <div className="hover:bg-white rounded-lg p-2 w-full">
                                        <NavLink
                                            to="/market"
                                            className=""
                                            onClick={() => setMobileMenu(false)}
                                        >
                                            Market
                                        </NavLink>
                                    </div>
                                    <div className="hover:bg-white rounded-lg p-2 w-full">
                                        <NavLink
                                            to="/job"
                                            className=""
                                            onClick={() => setMobileMenu(false)}
                                        >
                                            Job
                                        </NavLink>
                                    </div>
                                    <div className="hover:bg-white rounded-lg p-2 w-full">
                                        <NavLink
                                            to="/house"
                                            className=""
                                            onClick={() => setMobileMenu(false)}
                                        >
                                            House
                                        </NavLink>
                                    </div>
                                    <div className="hover:bg-white rounded-lg p-2 w-full">
                                        <NavLink
                                            to="/community"
                                            className=""
                                            onClick={() => setMobileMenu(false)}
                                        >
                                            Community
                                        </NavLink>
                                    </div>
                                    <div className="border border-white"> </div>
                                </div>
                            </>
                        )}

                        <div
                            onClick={clickProfile}
                            className="hover:bg-white p-3 text-xl rounded-lg font-bold"
                        >
                            profile
                        </div>
                        {isProfile && (
                            <>
                                {' '}
                                <div className="border border-white"> </div>
                                {!user && (
                                    <div className="px-7 space-y-3">
                                        <div
                                            className="font-bold"
                                            onClick={() => setMobileMenu(false)}
                                        >
                                            <NavLink to="/login">Login</NavLink>
                                        </div>
                                        <div>
                                            <NavLink
                                                to="/signup"
                                                onClick={() =>
                                                    setMobileMenu(false)
                                                }
                                            >
                                                Signup
                                            </NavLink>
                                        </div>
                                    </div>
                                )}
                                {user && (
                                    <div className="px-7 space-y-3">
                                        <div
                                            className="hover:bg-white rounded-lg p-2 w-full"
                                            onClick={() => setMobileMenu(false)}
                                        >
                                            <NavLink
                                                to={`/profile/${user.uid}`}
                                            >
                                                Profile
                                            </NavLink>
                                        </div>

                                        <div
                                            onClick={activeChatList}
                                            className="hover:bg-white rounded-lg p-2 w-full flex space-x-2"
                                        >
                                            <div>Chatting</div>
                                            <div>
                                                <BsChatHeart className="font-bold" />
                                            </div>
                                        </div>

                                        <div
                                            className="hover:bg-red-50 rounded-lg p-2 w-full"
                                            onClick={logout}
                                        >
                                            Logout
                                        </div>
                                    </div>
                                )}
                                <div className="border border-white"> </div>
                            </>
                        )}

                        <div
                            onClick={clickLanguage}
                            className="hover:bg-white p-3 text-xl  rounded-lg font-bold"
                        >
                            language
                        </div>
                        {isLanguage && (
                            <>
                                <div className="border border-white"> </div>
                                <div className="px-7 space-y-3 font-bold">
                                    <div className="hover:bg-white rounded-lg p-2 w-full">
                                        English
                                    </div>
                                    <div className="hover:bg-white rounded-lg p-2 w-full">
                                        한국어
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
