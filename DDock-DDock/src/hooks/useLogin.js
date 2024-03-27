import { useEffect, useState } from 'react';
import { useAuthContext } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { projectAuth } from '../firebase/config';

export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(true);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(null);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const login = async (email, password) => {
        try {
            const res = await projectAuth.signInWithEmailAndPassword(
                email,
                password
            );

            setError(null);
            setIsPending(true);
            dispatch({ type: 'LOGIN', payload: res.user });

            if (!isCancelled) {
                setIsPending(false);
                setError(null);
                const from = document.referrer || '/';
                navigate(from, { replace: true });
            }
        } catch (error) {
            if (!isCancelled) {
                setIsPending(false);
                setError(error.message);
            }
        }
    };

    useEffect(() => {
        return () => setIsCancelled(!isCancelled);
    }, [isCancelled]);

    return { login, isPending, error };
};
