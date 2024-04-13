import { useEffect, useReducer, useState } from 'react';
import { projectFirestore, timestamp, FieldValue } from '../firebase/config';
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

        case 'ADD_NEWCHATROOM':
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
            await updateDocument(user.uid, originalUser, 'User');

            dispatchIsNotCancelled({
                type: 'ADD_DOCUMENT',
                payload: newDocument,
            });
        } catch (error) {
            console.log(error);
            dispatchIsNotCancelled({ type: 'ERROR', payload: error.message });
        }

        setLoading(false);
    };

    const updateChat = async (collection, roomId, newMessage, partnerId) => {
        const ref = projectFirestore.collection(collection);
        setLoading(true);
        dispatch({ type: 'IS_PENDING' });
        const originalDocuments = await ref.doc(roomId).get();
        const chattinRoomData = originalDocuments.data(); 
        try {
            if (chattinRoomData.user1 == partnerId) {
                const updateChat = {
                    chat: FieldValue.arrayUnion(newMessage),
                    user1_unread: FieldValue.arrayUnion(newMessage),
                };
                const updatedChat = await ref.doc(roomId).update(updateChat);
                dispatchIsNotCancelled({
                    type: 'UPDATE_DOCUMENT',
                    payload: updatedChat,
                });
                setLoading(false);
                return updatedChat;
            } else if(chattinRoomData.user2 == partnerId){
                const updateChat = {
                    chat: FieldValue.arrayUnion(newMessage),
                    user2_unread: FieldValue.arrayUnion(newMessage),
                };
                const updatedChat = await ref.doc(roomId).update(updateChat);
                dispatchIsNotCancelled({
                    type: 'UPDATE_DOCUMENT',
                    payload: updatedChat,
                });
                setLoading(false);
                return updatedChat;
            }
        } catch (error) {
            console.log(error.message);
            setLoading(false);
            dispatchIsNotCancelled({ type: 'ERROR', payload: error.message });
            return originalDocuments;
        }
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
                    interests: [],
                    location: {
                        si: '',
                        gu: '',
                        dong: '',
                    },
                    chatRoom: [],
                });
                dispatchIsNotCancelled({
                    type: 'ADD_NEWCHATROOM',
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

    const createChattingRoom = async (user1, user2, collection) => {
        setLoading(true);
        dispatch({ type: 'IS_PENDING' });

        const chatRef = projectFirestore.collection(collection);

        try {
            const createdAt = formatDate(timestamp.fromDate(new Date()));
            let chatPartnerExist = false;
            let chatRoomID;

            user1.chatRoom.map((room) => {
                if (room.partner === user2.id) {
                    chatPartnerExist = true;
                    chatRoomID = room.roomId;
                }
            });
            if (!chatPartnerExist) {
                const newChattingRoom = await chatRef.add({
                    user1: user1.id,
                    user2: user2.id,
                    createdAt,
                    chat: [],
                    user1_unread: [],
                    user2_unread: [],
                });
                dispatchIsNotCancelled({
                    type: 'ADD_NEWUSER',
                    payload: newChattingRoom,
                });

                const originalUser2 = user2;
                const olduser2ChatRoom = originalUser2.chatRoom;
                const newUser2ChatRoom = {
                    roomId: newChattingRoom.id,
                    partner: user1.id,
                };
                const updatedUser2ChatRoom = [
                    ...olduser2ChatRoom,
                    newUser2ChatRoom,
                ];
                originalUser2.chatRoom = updatedUser2ChatRoom;

                await updateDocument(user2.id, originalUser2, 'User');

                const originalUser1 = user1;
                const olduser1ChatRoom = originalUser1.chatRoom;
                const newUser1ChatRoom = {
                    roomId: newChattingRoom.id,
                    partner: user2.id,
                };
                const updatedUser1ChatRoom = [
                    ...olduser1ChatRoom,
                    newUser1ChatRoom,
                ];
                originalUser1.chatRoom = updatedUser1ChatRoom;

                await updateDocument(user1.id, originalUser1, 'User');

                return newChattingRoom.id;
            } else if (chatPartnerExist) {
                return chatRoomID;
            }
        } catch (error) {
            dispatchIsNotCancelled({
                type: 'ERROR',
                payload: error.message,
            });
            console.log(error);
        }
        setLoading(false);
    };

    function formatDate(timestamp) {
        return new Date(timestamp.seconds * 1000).toLocaleString('en-AU', {
            timeZone: 'Australia/Sydney',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    }

    const readChat = async (collection, roomId, partnerId) => {

        const ref = projectFirestore.collection(collection);
        setLoading(true);
        dispatch({ type: 'IS_PENDING' });
        const originalDocuments = await ref.doc(roomId).get();
        const chattinRoomData = originalDocuments.data(); 
        try {
            console.log(chattinRoomData.user1)
            if (chattinRoomData.user1 == partnerId) {
                console.log("user 1 is partner")
              
                const updatedChat = await ref.doc(roomId).update({
                    user2_unread: []
                });
                dispatchIsNotCancelled({
                    type: 'UPDATE_DOCUMENT',
                    payload: updatedChat,
                });
                setLoading(false);
                console.log("end read");
                return updatedChat;

            } else if (chattinRoomData.user2 == partnerId) {
                console.log("user 2 is partner")

                const updatedChat = await ref.doc(roomId).update({
                    user1_unread: [],
                });
                dispatchIsNotCancelled({
                    type: 'UPDATE_DOCUMENT',
                    payload: updatedChat,
                });
                setLoading(false);
                console.log("end read");

                return updatedChat;
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        return () => setIsCancelled(!isCancelled);
    }, [isCancelled]);

    return {
        addDocument,
        updateDocument,
        deleteDocument,
        saveUser,
        createChattingRoom,
        updateChat,
        readChat,
        response,
        loading,
    };
};
