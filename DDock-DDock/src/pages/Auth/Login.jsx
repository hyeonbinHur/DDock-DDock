import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import GoogleButton from 'react-google-button';
import { useGoogleSignin } from '../../hooks/useGoogleSignIn';
import apple_logo from '../../assets/apple_logo/apple_logo.png';

import style from './Auth.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isPending, error } = useLogin();
    const { googleLogin } = useGoogleSignin();

    function consoleInfo(event) {
        event.preventDefault();
        console.log('Email : ' + email);
        console.log('Password : ' + password);
        login(email, password);
    }

    return (
        <form onSubmit={consoleInfo} className={style.form}>
            <div className={style.login_div1}>
                <label>Email로 로그인하기</label>
                <div>
                    <label>
                        <span>Email</span>
                        <input
                            required
                            name="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>password</label>
                    <input
                        required
                        name="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <p>
                    {error}
                    {isPending}
                </p>
                <button> Sign in</button>
            </div>

            <div className={style.login_div2}>
                <GoogleButton
                    onClick={googleLogin}
                    className={style.google_button}
                />

                <button className={style.apple_sign}>
                    <img src={apple_logo} className={style.apple_button} />
                    Sign in with Apple
                </button>
            </div>
        </form>
    );
}
