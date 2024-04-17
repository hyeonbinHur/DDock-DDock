import { projectAuth } from '../firebase/config';
import { useEffect, useState } from 'react';
import { useAuthContext } from './useAuth';

export const useLogout = () => {
    const [isCancelled, setIsCancelled] = useState(true);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch } = useAuthContext();

    const logout = async () => {
        setError(null);
        setIsPending(true);
        //sign user out

        try {
            await projectAuth.signOut();
            //dispatch log out action
            dispatch({ type: 'LOGOUT' });
            //update state

            if (!isCancelled) {
                setIsPending(false); // 에러를 이르키는건 이친구들이었음
                setError(null); // 에러를 일으키는건 이친구들!!
            }
        } catch (error) {
            if (!isCancelled) {
                setError(error.message);
                setIsPending(false);
            }
        }
    };

    useEffect(() => {
        return () => setIsCancelled(!isCancelled);
    }, [isCancelled]);

    return { logout, error, isPending };
};
