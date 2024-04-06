import { useEffect, useReducer, useState } from 'react';
import { projectFirestore, timestamp } from '../firebase/config';
import { useAuthContext } from './useAuth';
import { useDocument } from './useDocument';

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
        case 'ADD_NEWUSER':
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
    const { user } = useAuthContext();
    const { document } = useDocument('User', user?.uid);

    const dispatchIsNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action);
        }
    };

    const addDocument = async (doc, type, subtype) => {
        setLoading(true);
        dispatch({ type: 'IS_PENDING' });
        try {
            const createdAt = timestamp.fromDate(new Date());
            const userId = user.uid;
            const newDocument = await ref.add({
                ...doc,
                createdAt: createdAt,
                userId: userId,
                type: type,
                subtype: subtype,
                interests: 0,
            });

            const addedDocument = newDocument;
            const originalUser = document;
            const originalUserItem = originalUser.userItem;
            const updatedUserItem = [...originalUserItem, addedDocument];
            originalUser.userItem = updatedUserItem;
            await updateDocument(user.uid, originalUser,'User');



            dispatchIsNotCancelled({
                type: 'ADD_DOCUMENT',
                payload: newDocument,
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

    const updateDocument = async (id, updates, collection) => {
        
        const ref = projectFirestore.collection(collection);

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

    const saveUser = async (user) => {
        setLoading(true);
        dispatch({ type: 'IS_PENDING' });
        const userRef = ref.doc(user.uid);
        try {
            const currentUser = await userRef.get();

            if (!currentUser.exists) {
                const newUser = await userRef.set({
                    uid: user.uid,
                    displayName: user.displayName,
                    userItem: [],
                    userComment: [],
                    Avatar: null,
                    setDisplayName: false,
                    email: user.email,
                    interests:[],
                    location:{
                        si:'',
                        gu:'',
                        dong:'',
                        lat:'',
                        lng:'',
                    }
                });

                dispatchIsNotCancelled({
                    type: 'ADD_NEWUSER',
                    payload: newUser,
                });
            }
        } catch (error) {
            dispatchIsNotCancelled({
                type: 'ERROR',
                payload: error.message,
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        return () => setIsCancelled(!isCancelled);
    }, [isCancelled]);

    return {
        addDocument,
        updateDocument,
        deleteDocument,
        saveUser,
        response,
        loading,
    };
};
