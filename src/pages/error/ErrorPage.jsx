import { CiWarning } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import Navbar from '../../components/MainNavbar/MainNavBar';
import logo from '../../assets/logo/logo.png';

export default function ErrorPage() {
    return (
        <div>
            <Navbar />
            <div className="w-full h-full flex flex-col items-center justify-center pt-40 space-y-16">
                <div className="flex">
                    <CiWarning className="size-32 text-red-600 p" />
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold">404 Not Found!</h1>
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-bold">Error occurred!</h2>
                    <span className="text-md text-gray-400 inline-flex mt-3 break-words">
                        The requested pages was not found
                        <Link to={`/`} className="ml-5">
                            <img src={logo} className="w-[5rem]" />
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
}
