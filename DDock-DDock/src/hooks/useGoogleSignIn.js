import 'firebase/auth';
import { projectAuth } from '../firebase/config';
import { useEffect, useState } from 'react';
import { provider } from '../firebase/config';
import { useAuthContext } from './useAuth';

export const useGoogleSignin = () => {
    const [googleError, setError] = useState(null);
    const [googleIsPending, setIsPending] = useState(false);
    const [isCancelled, setIsCancelled] = useState(true);
    const { dispatch } = useAuthContext();

    const googleLogin = async () => {
        setError(null);
        setIsPending(true);
        try {
            const res = await projectAuth.signInWithPopup(provider
            );
            if (!res) {
                console.log('구글 로그인 에러 씨발');
            }

            dispatch({ type: 'LOGIN', payload: res.user });


            if (!isCancelled) {
                setError(null);
                setIsPending(false);
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
    return { googleLogin, googleError, googleIsPending };
};
