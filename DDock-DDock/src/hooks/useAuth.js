import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export const useAuthContext = () => {
    //밑에줄이 AuthContext의 dispath에 접근?
    const context = useContext(AuthContext);

    if (!context) {
        // throw Error('useAuthContext must be inside of an AuthContextProvider');
        console.log('Error');
    }

    return context;
};
