import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuthContext = () => {
    //밑에줄이 AuthContext의 dispath에 접근?
    const context = useContext(AuthContext);

    if(!context){
        throw Error('useAuthContext must be inside of an AuthContextProvider');
    }

    return context;
};
