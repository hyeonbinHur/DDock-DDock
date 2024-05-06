import { useEffect, useState } from 'react';
import { projectAuth } from '../firebase/config';
import { useAuthContext } from './useAuth';
import { useFirestore } from './useFirestore';

export const useSignUp = () => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const { dispatch } = useAuthContext();
    const [isCancelled, setIsCancelled] = useState(true);
    const { saveUser } = useFirestore('User');

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

            await res.user.updateProfile({
                displayName: nickName,
                setDisplayName: true,
            });
            await saveUser(res.user);

            dispatch({ type: 'LOGIN', payload: res.user });
            if (!isCancelled) {
                setIsPending(false);
                setError(null);
            }
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
