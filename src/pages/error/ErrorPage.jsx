import { Link } from 'react-router-dom';
import Navbar from '../../components/MainNavbar/MainNavBar';

export default function ErrorPage(){
    return <div>
        <Navbar />
        <h1>아이고..페이지를 찾을 수 없어요!</h1>

        <p>찾으시려는 페이지의 주소가 잘못 입력되었거나, 페이지 주소가 변경되어 더이상 사용할 수 없는 페이지입니다. 페이지의 주소를 다시한번 확인해 주세요</p>
        <Link to={`/`}><button>로고</button></Link>
        
    </div>;
}