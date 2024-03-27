import { useState } from 'react';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickName, setNickName] = useState('');

    function consoleInfo(){
        console.log("Email : " + email)
        console.log("Password : " + password)
        console.log("Nick name : " + nickName)
    }
    return (
        <form>
            <div>
                <label>
                    <span>Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </div>
            <div>
                <label>Nick name</label>
                <input
                    type="text"
                    value={nickName}
                    onChange={(event) => setNickName(event.target.value)}
                />
            </div>

            <button onClick={consoleInfo}> console info</button>
        </form>
    );
}
