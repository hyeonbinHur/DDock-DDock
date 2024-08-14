import 'firebase/auth';
import { projectAuth } from '../firebase/config';
import { useEffect, useState } from 'react';
import { facebookProvider } from '../firebase/config';
import { useAuthContext } from './useAuth';
import { useFirestore } from './useFirestore';
import { useNavigate } from 'react-router-dom';

export const useFaceBookSignIn = () => {
    const [facebookError, setError] = useState(null);
    const [facebookIsPending, setIsPending] = useState(false);
    const { dispatch } = useAuthContext();
    const { saveUser } = useFirestore('User');
    const navigate = useNavigate();

    const facebookSignIn = async () => {
        setError(null);
        setIsPending(true);
        try {
            const res = await projectAuth.signInWithPopup(facebookProvider);
            if (!res) {
                throw new Error('Could not complete signup');
            }
            await saveUser(res.user);
            dispatch({ type: 'LOGIN', payload: res.user });
            setError(null);
            setIsPending(false);
            navigate(-1);
        } catch (error) {
            console.error(error.code);
            if (error.code === 'auth/popup-closed-by-user') {
                setError('Facebook login was cancelled by the user');
                console.log('Facebook login popup was closed by the user.'); // 이 로그를 추가
            } else {
                setError(error.message);
            }
            setIsPending(false);
        }
    };

    useEffect(() => {
        return () => {
            console.log('Component is unmounting...'); // 언마운트 시 출력될 메시지
        };
    }, []);

    return { facebookSignIn, facebookError, facebookIsPending };
};
