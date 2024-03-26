import { useEffect, useReducer, useState } from 'react';
import { projectFirestore } from '../firebase/config';

let initalState = {
    document: null,
    isPending: false,
    error: null,
    success: null,
};

const firestoreReducer = (state, action) => {
    switch (action.type) {
        case 'IS_PENDING':
            return {
                ...state,
                isPending: true,
                document: null,
                success: false,
                error: null,
            };
        case 'ADD_DOCUMENT':
            return {
                ...state,
                isPending: false,
                document: action.payload,
                success: true,
                error: null,
            };

        case 'ERRROR':
            return {
                ...state,
                isPending: false,
                document: null,
                success: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const useFirestore = (collection) => {
    const [response, dispatch] = useReducer(firestoreReducer, initalState);
    const [isCancelled, setIsCancelled] = useState(true);

    const ref = projectFirestore.collection(collection);

    const dispatchIsNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action);
        }
    };

    const addDocument = async (doc) => {

        dispatch({ type: 'IS_PENDING' });
        try {
            const addedDocument = ref.add({ ...doc });
            dispatchIsNotCancelled({
                type: 'ADD_DOCUMENT',
                payload: addedDocument,
            });
        } catch (error) {
            dispatchIsNotCancelled({ type: 'ERROR', payload: error.message });
        }
        
    };

    useEffect(() => {
        return () => setIsCancelled(!isCancelled);
    }, [isCancelled]);

    return { addDocument, response, isPending: response.isPending };
};
