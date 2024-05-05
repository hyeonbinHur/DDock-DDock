import { Outlet, useLocation } from 'react-router-dom';
import style from './Root.module.css';
import Navbar from '../components/MainNavbar/MainNavBar';

function RootLayout() {
    // const navigation = useNavigation();
    const location = useLocation();
    const path = location.pathname;
    const hideNavbarOnPaths = ['/login', '/signup'];

    return (
        <>
            {!hideNavbarOnPaths.includes(path) && <Navbar />}
            <main className={style.main}>
                <Outlet />
            </main>
        </>
    );
}

export default RootLayout;
