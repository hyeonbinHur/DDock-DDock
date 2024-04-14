import { NavLink } from 'react-router-dom';
import style from './MainNavBar.module.css';
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../hooks/useAuth';
import { useState } from 'react';
import ChattingRoomList from '../Chatting/ChattingRoomList';
import { useDocument } from '../../hooks/useDocument';
import { useSelector } from 'react-redux';
import PrivateChattingRoom from '../Chatting/PrivateChattingRoom';
import toast, { Toaster } from 'react-hot-toast';

const notify = () => toast('Here is your toast.');

export default function Navbar() {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const [showChatList, setShowChatList] = useState(false);

    const { document: currentUser } = useDocument('User', user?.uid);

    const openChatRoom = useSelector(
        (state) => state.openChatRoom.openChatRoom
    );

    const activeChatList = () => {
        setShowChatList(!showChatList);
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
