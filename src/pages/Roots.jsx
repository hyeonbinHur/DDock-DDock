import { Outlet } from 'react-router-dom';
import style from './Root.module.css';
import Navbar from '../components/MainNavbar/MainNavBar';

function RootLayout() {
  // const navigation = useNavigation();

  return (
    <>
      <Navbar />
      <main className={style.main}>
        <Outlet />
      
      </main>
    </>
  );
}

export default RootLayout;