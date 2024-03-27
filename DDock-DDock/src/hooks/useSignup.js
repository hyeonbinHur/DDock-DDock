import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAuth } from '../firebase/config';
import { useAuthContext } from './useAuth';

export const useSignUp = () => {
    
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { dispatch } = useAuthContext();
    const [isCancelled, setIsCancelled] = useState(true);

    const signUp = async (email, password, nickName) => {
        setError(null);
        setIsPending(true);

        try {
            const res = await projectAuth.createUserWithEmailAndPassword(
                email,
                password
            );

            if (!res) {
                throw new Error('Could not complete signup');
            }
            await res.user.updateProfile({ nickName });
            dispatch({ type: 'LOGIN', payload: res.user });
            if (!isCancelled) {
                setIsPending(false);
                setError(null);
            }

            const from = document.referrer || '/';
            navigate(from, { replace: true });
        } catch (error) {
            setIsPending(false);
            setError(error.message);
        }
    };

    useEffect(() => {
        return () => setIsCancelled(!isCancelled);
    }, [isCancelled]);

    return { signUp, error, isPending };
};
