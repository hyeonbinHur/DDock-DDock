import 'firebase/auth';
import { projectAuth } from '../firebase/config';
import { useEffect, useState } from 'react';
import { provider } from '../firebase/config';
import { useAuthContext } from './useAuth';
import { useFirestore } from './useFirestore';
import { useNavigate } from 'react-router-dom';

export const useGoogleSignin = () => {
    const [googleError, setError] = useState(null);
    const [googleIsPending, setIsPending] = useState(false);
    const [isCancelled, setIsCancelled] = useState(true);
    const { dispatch } = useAuthContext();
    const { saveUser } = useFirestore('User');
    const navigate = useNavigate();

    const googleLogin = async () => {
        setError(null);
        setIsPending(true);
        try {
            const res = await projectAuth.signInWithPopup(provider);
            if (!res) {
                throw new Error('Could not complete signup');
            }

            await saveUser(res.user);

            dispatch({ type: 'LOGIN', payload: res.user });

            if (!isCancelled) {
                setError(null);
                setIsPending(false);
                navigate(-1);
            }
        } catch (error) {
            if (!isCancelled) {
                setError(null);
                setIsPending(error.message);
            }
        }
    };

    useEffect(() => {
        return () => setIsCancelled(!isCancelled);
    }, [isCancelled]);
    return { googleLogin, isCancelled, googleError, googleIsPending };
};
