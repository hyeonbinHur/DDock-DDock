import { useEffect, useReducer, useState } from 'react';
import { projectFirestore, timestamp } from '../firebase/config';

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

        case 'DELETED_DOCUMENT':
            return {
                ...state,
                isPending: false,
                document: action.payload,
                success: true,
                error: null,
            };
        case 'UPDATE_DOCUMENT':
            return {
                ...state,
                isPending: false,
                document: action.payload,
                success: true,
                error: null,
            };

        case 'ERROR':
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
    const [loading, setLoading] = useState(false);
    const ref = projectFirestore.collection(collection);

    const dispatchIsNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action);
        }
    };

    const addDocument = async (doc) => {
        setLoading(true);

        dispatch({ type: 'IS_PENDING' });

        try {
            const createdAt = timestamp.fromDate(new Date());
            const addedDocument = await ref.add({ ...doc, createdAt: createdAt  });
            
            dispatchIsNotCancelled({
                type: 'ADD_DOCUMENT',
                payload: addedDocument,
            });
        } catch (error) {
            dispatchIsNotCancelled({ type: 'ERROR', payload: error.message });
        }

        setLoading(false);
    };

    const deleteDocument = async (id) => {
        setLoading(true);
        dispatch({ type: 'IS_PENDING' });

        try {
            const deletedDocument = await ref.doc(id).delete();
            dispatchIsNotCancelled({
                type: 'DELETED_DOCUMENT',
                payload: deletedDocument,
            });
        } catch (error) {
            dispatchIsNotCancelled({ type: 'ERROR', payload: error.message });
        }

        setLoading(false);
    };

    const updateDocument = async (id, updates) => {
        setLoading(true);

        dispatch({ type: 'IS_PENDING' });

        try {
            const updatedDocument = await ref.doc(id).update(updates);
            dispatchIsNotCancelled({
                type: 'UPDATE_DOCUMENT',
                payload: updatedDocument,
            });
            setLoading(false);

            return updatedDocument;
        } catch (error) {
            setLoading(false);

            dispatchIsNotCancelled({ type: 'ERROR', payload: error.message });
            return null;
        }
    };

    useEffect(() => {
        return () => setIsCancelled(!isCancelled);
    }, [isCancelled]);

    return { addDocument, updateDocument, deleteDocument, response, loading };
};
