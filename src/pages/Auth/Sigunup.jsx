/* eslint-disable react/no-unescaped-entities */
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { useState, useRef } from 'react';
import { useSignUp } from '../../hooks/useSignup';
import { useGoogleSignin } from '../../hooks/useGoogleSignIn';
import DisplayNameModal from '../../components/Modal/DisplayNameModal';

import pocketLogo from '../../assets/logo/logo.png';
import googleLogo from '../../assets/logo/googleLogo.png';
import facebookLogo from '../../assets/logo/facebookLogo.png';
import { useNavigate } from 'react-router-dom';
import { AiOutlineUser } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useFaceBookSignIn } from '../../hooks/useFacebookSingIn';

import spinner4 from '../../assets/logo/spinner4.svg';

import {
    isEmail,
    isNotEmpty,
    isPassword,
    isDisplayName,
    isPasswordMatch,
} from '../../util/authValid';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const { signUp, error, isPending } = useSignUp();
    const { googleLogin, googleIsPending } = useGoogleSignin();
    const [confirmPassword, setConfirmPassword] = useState('');
    const modal = useRef();
    const { facebookSignIn, facebookIsPending } = useFaceBookSignIn();

    // const [emailIsInValid, setEmailIsInvalid] = useState(false);
    // const [passwordIsInvalid, setPasswordIsInvalid] = useState(false);
    // const [displayNameIsInvalid, setDisplayNameIsInvalid] = useState(false);
    // const [confirmIsInvalid, setConfirmIsInvalid] = useState(false);

    const emailIsInValid = !isEmail(email) && isNotEmpty(email);
    const passwordIsInvalid = !isPassword(password) && isNotEmpty(password);
    const displayNameIsInvalid =
        !isDisplayName(displayName) && isNotEmpty(displayName);
    const confirmIsInvalid =
        !isPasswordMatch(password, confirmPassword) &&
        isNotEmpty(confirmPassword);

    const navigate = useNavigate();

    function consoleInfo(event) {
        event.preventDefault();
        if (
            !emailIsInValid &&
            !passwordIsInvalid &&
            !displayNameIsInvalid &&
            !confirmIsInvalid
        ) {
            signUp(email, password, displayName);
        }

        if (error == null && isPending == false) {
            console.log('Hello world');
        }
    }

    function handleGoogleSignUp() {
        googleLogin();
    }

    const goBack = () => {
        navigate(-1); // 이전 페이지로 돌아가기
    };

    if (isPending || googleIsPending || facebookIsPending) {
        return (
            <img
                src={spinner4}
                className="lg:size-72 size-52 absolute top-52 right-[27%] lg:right-[42%]"
            />
        );
    }

    return (
        <div>
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
                            <div
                                className={`${
                                    emailIsInValid
                                        ? `border border-red-400 text-red-400`
                                        : ``
                                } flex w-full h-12 bg-gray-50 flex-cols items-center`}
                            >
                                <AiOutlineUser
                                    className={`${
                                        emailIsInValid
                                            ? `text-red-400`
                                            : `text-gray-500`
                                    } size-6 `}
                                />
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
                            {emailIsInValid && (
                                <div className="px-10 py-2 text-sm text-red-400">
                                    Email must includes '@'.
                                </div>
                            )}

                            <div className="w-full flex justify-center">
                                <div className="w-11/12 h-[1px] border border-gray-100"></div>
                            </div>

                            <div
                                className={`${
                                    displayNameIsInvalid
                                        ? `border border-red-400 text-red-400`
                                        : ``
                                } flex w-full h-12 bg-gray-50 flex-cols items-center`}
                            >
                                <AiOutlineUser
                                    className={`${
                                        displayNameIsInvalid
                                            ? `text-red-400`
                                            : ` text-gray-500`
                                    } size-6`}
                                />

                                <div className="h-5/6 w-[1px] border border-gray-300 mx-2"></div>
                                <input
                                    className="outline-none w-10/12 bg-transparent"
                                    required
                                    name="displayName"
                                    type="text"
                                    value={displayName}
                                    onChange={(event) =>
                                        setDisplayName(event.target.value)
                                    }
                                    placeholder="Display Name"
                                />
                            </div>

                            {displayNameIsInvalid && (
                                <div className="px-10 py-2 text-sm text-red-400">
                                    Displayname must be longer 4 letters.
                                </div>
                            )}

                            <div className="w-full flex justify-center">
                                <div className="w-11/12 h-[1px] border border-gray-100"></div>
                            </div>

                            <div
                                className={`${
                                    passwordIsInvalid
                                        ? `border border-red-400 text-red-400`
                                        : ``
                                } flex w-full h-12 bg-gray-50 flex-cols items-center`}
                            >
                                <RiLockPasswordLine
                                    className={`${
                                        passwordIsInvalid
                                            ? `text-red-400`
                                            : `text-gray-500`
                                    } size-6 `}
                                />
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
                            {passwordIsInvalid && (
                                <div className="px-10 py-2 text-sm text-red-400">
                                    Password must be longer than 7 letters.
                                </div>
                            )}

                            <div className="w-full flex justify-center">
                                <div className="w-11/12 h-[1px] border border-gray-100"></div>
                            </div>

                            <div
                                className={`${
                                    confirmIsInvalid
                                        ? `border border-red-400 text-red-400`
                                        : ``
                                } flex w-full h-12 bg-gray-50 flex-cols items-center`}
                            >
                                <AiOutlineCheckCircle
                                    className={`${
                                        confirmIsInvalid
                                            ? `text-red-400`
                                            : `text-gray-500`
                                    } size-6 `}
                                />
                                <div className="h-5/6 w-[1px] border border-gray-300 mx-2"></div>

                                <input
                                    className="outline-none w-10/12 bg-transparent"
                                    required
                                    name="password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(event.target.value)
                                    }
                                    placeholder="Confirm Password"
                                />
                            </div>
                            {confirmIsInvalid && (
                                <div className="px-10 py-2 text-sm text-red-400">
                                    Password must match.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center w-full lg:w-2/5 justify-center">
                        <button className="cursor-pointer border w-10/12 h-11 rounded-lg bg-sky-400 font-bold text-white flex items-center justify-center ">
                            Sign Up
                        </button>
                    </div>

                    <div className="pt-7 flex flex-col justify-center items-center space-y-3">
                        <Link to={'/login'}>
                            <div className=" text-sky-500 cursor-pointer">
                                Sing In
                            </div>
                        </Link>

                        <div className="text-gray-500 ">
                            Sing in & Join With
                        </div>
                    </div>

                    <div className="flex justify-center space-x-5 pt-3">
                        <div
                            onClick={() => handleGoogleSignUp()}
                            className="lg:w-16 lg:h-16 w-11 h-11 flex items-center border justify-center border-gray-300 rounded-full hover:scale-105"
                        >
                            <img src={googleLogo} className="w-7 lg:w-9" />
                        </div>
                        <div
                            onClick={() => facebookSignIn()}
                            className="w-10 lg:w-16 lg:h-16 hover:scale-105"
                        >
                            <img src={facebookLogo} className="w-11 lg:w-14" />
                        </div>
                    </div>
                </div>
            </form>
            <DisplayNameModal ref={modal} />
        </div>
    );
}
