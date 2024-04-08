import { NavLink } from 'react-router-dom';
import style from './MainNavBar.module.css';
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../hooks/useAuth';
export default function Navbar() {
    const { logout } = useLogout();
    const { user } = useAuthContext();

    return (
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
                            <NavLink to={`/profile/${user.uid}`}>Profile /</NavLink>
                        </li>
                    </>
                )}

                <li>
                    <p> 채팅 </p>
                </li>
            </ul>
        </nav>
    );
}
