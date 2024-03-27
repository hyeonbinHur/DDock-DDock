import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isPending, error } = useLogin();
    function consoleInfo(event) {
        event.preventDefault();
        console.log('Email : ' + email);
        console.log('Password : ' + password);
        login(email, password);
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
            <p>
                {error},{isPending}
            </p>
            <button > console info</button>
        </form>
    );
}
