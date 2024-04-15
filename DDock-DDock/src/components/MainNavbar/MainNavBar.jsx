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

export default function Navbar() {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const [showChatList, setShowChatList] = useState(false);

    const { document: currentUser } = useDocument('User', user?.uid);

    const openChatRoom = useSelector(
        (state) => state.openChatRoom.openChatRoom
    );
    const [oldUser, setOldUser] = useState(currentUser?.unread);

    const activeChatList = () => {
        setShowChatList(!showChatList);
    };

    useEffect(() => {
        // 올드 유저를 저장하고, 올드유저 unread값이랑 현 업데이트된 unread값이 다르면 토스트
        if (oldUser) {
            if(oldUser){
                if(oldUser.length === currentUser.unread.length){
                    oldUser.forEach((chat) => {
                        currentUser.unread.some((real) => {
                            if (chat.roomId == real.roomId) {
                                if (chat.chat.length < real.chat.length) {
                                    receiveMessageFromOldRoom(
                                        real.chat[real.chat.length - 1],
                                        real.sender
                                    );
                                }
                            }
                        });
                    });

                }else if (oldUser.length !== currentUser.unread.length){
                    receiveMessageFromNewRoom(currentUser.unread[currentUser.unread.length-1].chat[0].content ,currentUser.unread[currentUser.unread.length-1].sender);
                }
            }
        }
        setOldUser(currentUser?.unread);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.unread]);

    const notify = (sender, content) => {
        toast(sender + '님이 메세지를 보냈어요 : ' + content);
    };

    const receiveMessageFromOldRoom = (content, sender) => {
        notify(sender, content.content);
    };

    const receiveMessageFromNewRoom = (content, sender) => {
        notify(sender, content.content);
    };

    return (
        <div>
            <nav className={style.navbar}>
                <ul>
                    <li>
                        <NavLink to="/">Home /</NavLink>
                    </li>
                    <li>
                        <NavLink to="/market">Market /</NavLink>
                    </li>
                    <li>
                        <NavLink to="/job">Job /</NavLink>
                    </li>
                    <li>
                        <NavLink to="/house">House /</NavLink>
                    </li>
                    <li>
                        <NavLink to="/community">Community /</NavLink>
                    </li>
                    <li>
                        <NavLink to="/csstest">memo /</NavLink>
                    </li>
                    {/* <li>
                    <NavLink to="/signup">Login</NavLink>
                </li>
                <li>
                    <NavLink to="/signup">Signup</NavLink>
                </li> */}
                    {!user && (
                        <>
                            <li>
                                <NavLink to="/login">Login</NavLink>
                            </li>
                            <li>
                                <NavLink to="/signup">Signup</NavLink>
                            </li>
                        </>
                    )}

                    {user && (
                        <>
                            <li>
                                <button className="btn" onClick={logout}>
                                    Logout
                                </button>
                            </li>
                            <li>
                                <NavLink to={`/profile/${user.uid}`}>
                                    Profile /
                                </NavLink>
                            </li>
                            <li>
                                <button onClick={activeChatList}> 채팅 </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            {showChatList && (
                <div className={style.popupContainer}>
                    <ChattingRoomList user={currentUser} />
                </div>
            )}
            {openChatRoom && (
                <div className={style.ChatpopupContainer}>
                    {' '}
                    <PrivateChattingRoom />{' '}
                </div>
            )}

            <div>
                <Toaster />
            </div>
        </div>
    );
}
