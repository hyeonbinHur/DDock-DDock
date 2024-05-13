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
    const [isCancelled, setIsCancelled] = useState(true);
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

            if (!isCancelled) {
                setError(null);
                setIsPending(false);
                navigate(-1);
            }
        } catch (error) {
            console.error(error);
            if (!isCancelled) {
                setError(null);
                setIsPending(error.message);
            }
        }
    };

    useEffect(() => {
        return () => setIsCancelled(!isCancelled);
    }, [isCancelled]);
    return { facebookSignIn, facebookError, facebookIsPending };
};
