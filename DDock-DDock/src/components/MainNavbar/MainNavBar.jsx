import { NavLink } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>

                <li>
                    <NavLink to="/market">Market</NavLink>
                </li>
                <li>
                    <NavLink to="/job">Job</NavLink>
                </li>
                <li>
                    <NavLink to="/house">House</NavLink>
                </li>
                <li>
                    <NavLink to="/community">Community</NavLink>
                </li>
                {/* <li>
                    <NavLink to="/signup">Login</NavLink>
                </li>
                <li>
                    <NavLink to="/signup">Signup</NavLink>
                </li> */}

                <li>
                    <button className="btn">Logout</button>
                </li>
            </ul>
        </nav>
    );
}
