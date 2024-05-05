import { BiArrowBack } from 'react-icons/bi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { AiOutlineUser } from 'react-icons/ai';
/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
// import GoogleButton from 'react-google-button';
import { useGoogleSignin } from '../../hooks/useGoogleSignIn';
// import apple_logo from '../../assets/apple_logo/apple_logo.png';
import style from './Auth.module.css';
import { useNavigate } from 'react-router-dom';
import pocketLogo from '../../assets/logo/logo.png';
import googleLogo from '../../assets/logo/googleLogo.png';
import facebookLogo from '../../assets/logo/facebookLogo.png';
import { Link } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isPending, error } = useLogin();
    const { googleLogin } = useGoogleSignin();
    const navigate = useNavigate();

    function consoleInfo(event) {
        event.preventDefault();
        console.log('Email : ' + email);
        console.log('Password : ' + password);
        login(email, password);
    }

    const goBack = () => {
        navigate(-1); // 이전 페이지로 돌아가기
    };

    return (
        <form onSubmit={consoleInfo} className=" w-screen h-screen">
            <div className="pt-5 pl-5" onClick={() => goBack()}>
                <BiArrowBack className="size-10 text-gray-400" />
            </div>

            <div className=" absolute top-[20%] lg:top-[12%] flex flex-col items-center space-y-5 mx-4 w-full ">
                <div className="w-full flex justify-center p-5 rounded-t-lg mb-7">
                    <Link to={'/'} className="w-44 flex items-center">
                        <img src={pocketLogo} className="w-full" />
                    </Link>
                </div>

                <div className="flex w-full flex-col items-center rounded-lg lg:w-2/5">
                    <div className="bg-gray-50 rounded-lg border w-10/12 p-1">
                        <div className="flex w-full h-12 bg-gray-50 flex-cols items-center rounded-lg">
                            <AiOutlineUser className="size-6 text-gray-500" />
                            <div className="h-5/6 w-[1px] border border-gray-300 mx-2"></div>
                            <input
                                className="outline-none w-10/12 bg-transparent"
                                required
                                name="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="Email"
                            />
                        </div>

                        <div className="w-full flex justify-center">
                            <div className="w-11/12 h-[1px] border border-gray-100"></div>
                        </div>

                        <div className="flex w-full h-12 bg-gray-50 flex-cols items-center">
                            <RiLockPasswordLine className="size-6 text-gray-500" />
                            <div className="h-5/6 w-[1px] border border-gray-300 mx-2"></div>

                            <input
                                className="outline-none w-10/12 bg-transparent"
                                required
                                name="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Password"
                            />
                        </div>
                    </div>
                </div>

                <p>
                    {error}
                    {isPending}
                </p>
                <div className="flex items-center w-full lg:w-2/5 justify-center">
                    <div className="border w-10/12 h-11 rounded-lg bg-sky-400 font-bold text-white flex items-center justify-center ">
                        Sign in
                    </div>
                </div>

                <div>
                    <div className="text-gray-500 pt-7">
                        Sing in & Join With
                    </div>
                </div>

                <div className="flex justify-center space-x-5 pt-3">
                    <div
                        onClick={googleLogin}
                        className="lg:w-16 lg:h-16 w-11 h-11 flex items-center border justify-center border-gray-300 rounded-full"
                    >
                        <img src={googleLogo} className="w-7 lg:w-9" />
                    </div>
                    <div className="w-10 lg:w-16 lg:h-16 ">
                        <img src={facebookLogo} className="w-11 lg:w-14" />
                    </div>
                </div>

                <div className={style.login_div2}>
                    {/* <GoogleButton
                        onClick={googleLogin}
                        className={style.google_button}
                    /> */}

                    {/* <button className={style.apple_sign}>
                        <img src={apple_logo} className={style.apple_button} />
                        Sign in with Apple
                    </button> */}
                </div>
            </div>
        </form>
    );
}
