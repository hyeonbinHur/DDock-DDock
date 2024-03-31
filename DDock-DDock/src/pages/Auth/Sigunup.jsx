import { useState } from 'react';
import { useSignUp } from '../../hooks/useSignup';
import GoogleButton from 'react-google-button';
import { useGoogleSignin } from '../../hooks/useGoogleSignIn';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickName, setNickName] = useState('');
    const { signUp, error, isPending } = useSignUp();
    const { googleLogin } = useGoogleSignin();

    function consoleInfo(event) {
        event.preventDefault();
    
        signUp(email, password, nickName);
    }
    return (
        <form onSubmit={consoleInfo}>
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
            <div>
                <label>Nick name</label>
                <input
                    required
                    name="nickName"
                    type="text"
                    value={nickName}
                    onChange={(event) => setNickName(event.target.value)}
                />
            </div>

            <button> Sign up</button>

            {!isPending && <button className="btn">Sign up</button>}
            {isPending && (
                <button className="btn" disabled>
                    loading
                </button>
            )}
            {error && <p>{error}</p>}
            
            <GoogleButton onClick={googleLogin}>Sign Up </GoogleButton>
        </form>
    );
}
