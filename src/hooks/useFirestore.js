import { useEffect, useReducer, useState } from 'react';
import { projectFirestore, timestamp, FieldValue } from '../firebase/config';
import { useAuthContext } from './useAuth';
import { useDocument } from './useDocument';
import {formatDate} from '../util/formDate'
import { useDispatch } from 'react-redux';
import {addItem} from '../store/marketCollectionSlice'

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

    const reduxDispatch = useDispatch()

    const dispatchIsNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action);
        }
    };

    const addDocument = async (doc,) => {
        setLoading(true);
        dispatch({ type: 'IS_PENDING' });
        try {
            const newDocument = await ref.add({
                ...doc
            });
            console.log(newDocument.id)
            
            const reduxItem = {
                ...doc,
                id: newDocument.id
            }
            reduxDispatch(addItem(reduxItem));

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

    const updateChat = async (
        collection,
        roomId,
        newMessage,
        partnerId,
        myId
    ) => {
        console.log('partner Id ' + partnerId);
        const ref = projectFirestore.collection(collection);
        const partnerRef = projectFirestore.collection('User');
        const partnerInfo = await partnerRef.doc(partnerId).get();
        const partnerData = partnerInfo.data();

        setLoading(true);
        dispatch({ type: 'IS_PENDING' });
        const originalDocuments = await ref.doc(roomId).get();
        const chattinRoomData = originalDocuments.data();
        try {
            if (
                partnerData.unread.some(
                    (unreadByRoom) => unreadByRoom.roomId === roomId
                )
            ) {
                partnerData.unread.forEach((unreadByRoom) => {
                    if (unreadByRoom.roomId === roomId) {
                        unreadByRoom.chat.push({
                            content: newMessage.content,
                            createdAt: newMessage.createdAt,
                            id: newMessage.id,
                            type: newMessage.type,

                        });
                    }
                });
                if (myId !== 'GM') {
                    await partnerRef.doc(partnerId).update({
                        unread: partnerData.unread,
                    });
                }

                // 만약 유저가 unread에 우리 방이 있으면, 그방에 새로온 메세지 추가해서
                // 유저 언리드 업데이트
            } else if (
                !partnerData.unread.some((chat) => chat.roomId === roomId) ||
                partnerData.unread === undefined
            ) {
                // 만약 유저 unread에 우리 방이 없다면, 유저 unread에 우리방 추가
                const unreadByRoom = {
                    roomId,
                    sender: myId,
                    chat: [
                        {
                            content: newMessage.content,
                            createdAt: newMessage.createdAt,
                            id: newMessage.id,
                            type: newMessage.type,
                        },
                    ],
                };
                if (myId !== 'GM') {
                    const updateUnread = {
                        unread: FieldValue.arrayUnion(unreadByRoom),
                    };

                    await partnerRef.doc(partnerId).update(updateUnread);
                }
            }

            if (myId === 'GM') {
                const updateChat = {
                    chat: FieldValue.arrayUnion(newMessage),
                };
                const updatedChat = await ref.doc(roomId).update(updateChat);
                dispatchIsNotCancelled({
                    type: 'UPDATE_DOCUMENT',
                    payload: updatedChat,
                });
                setLoading(false);
                return updatedChat;
            } else {
                if (chattinRoomData.user1 == partnerId) {
                    const updateChat = {
                        chat: FieldValue.arrayUnion(newMessage),
                        user1_unread: FieldValue.arrayUnion(newMessage),
                    };
                    const updatedChat = await ref
                        .doc(roomId)
                        .update(updateChat);
                    dispatchIsNotCancelled({
                        type: 'UPDATE_DOCUMENT',
                        payload: updatedChat,
                    });
                    setLoading(false);
                    return updatedChat;
                } else if (chattinRoomData.user2 == partnerId) {
                    const updateChat = {
                        chat: FieldValue.arrayUnion(newMessage),
                        user2_unread: FieldValue.arrayUnion(newMessage),
                    };
                    const updatedChat = await ref
                        .doc(roomId)
                        .update(updateChat);
                    dispatchIsNotCancelled({
                        type: 'UPDATE_DOCUMENT',
                        payload: updatedChat,
                    });
                    setLoading(false);
                    return updatedChat;
                }
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
                    unread: [],
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
                    started: false,
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
                    started: false,

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

    // function formatDate(timestamp) {
    //     return new Date(timestamp.seconds * 1000).toLocaleString('en-AU', {
    //         timeZone: 'Australia/Sydney',
    //         year: 'numeric',
    //         month: 'numeric',
    //         day: 'numeric',
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         second: '2-digit',
    //         hour12: false,
    //     });
    // }

    const readChat = async (collection, roomId, myId) => {
        const userRef = projectFirestore.collection(collection);
        setLoading(true);
        dispatch({ type: 'IS_PENDING' });
        const originalDocuments = await userRef.doc(myId).get();
        const userData = originalDocuments.data();
        try {
            const oldUserUnreadArray = userData.unread;

            if (
                oldUserUnreadArray.some(
                    (unreadChatRoom) => unreadChatRoom.roomId === roomId
                )
            ) {
                oldUserUnreadArray.forEach((unreadChatRoom) => {
                    if (unreadChatRoom.roomId === roomId) {
                        unreadChatRoom.chat = [];
                    }
                });
                const updatedChat = await userRef.doc(myId).update({
                    unread: oldUserUnreadArray,
                });
                dispatchIsNotCancelled({
                    type: 'UPDATE_DOCUMENT',
                    payload: updatedChat,
                });
                setLoading(false);
                return updatedChat;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const startChat = async (roomID, myId, partnerId) => {
        const myRef = projectFirestore.collection('User');
        const partnerRef = projectFirestore.collection('User');

        setLoading(true);
        dispatch({ type: 'IS_PENDING' });
        try{

            const myDoc = await myRef.doc(myId).get()
            const myData = myDoc.data()

            const partnerDoc = await partnerRef.doc(partnerId).get()
            const partnerData = partnerDoc.data()

            const myChatRoom = myData.chatRoom
            myChatRoom.forEach((chatRoom)=>{
                if(chatRoom.roomId === roomID){
                    chatRoom.started = true;
                }
            })

            await myRef.doc(myId).update({
                chatRoom: myChatRoom
            })

            const partnerChatRoom = partnerData.chatRoom
            partnerChatRoom.map((chatRoom) => {
                if(chatRoom.roomId === roomID){
                    console.log("찾긴함")
                    chatRoom.started = true;
                }
            })
            await partnerRef.doc(partnerId).update({
                chatRoom: partnerChatRoom
            })
            
            dispatchIsNotCancelled({
                type: 'UPDATE_DOCUMENT',
                payload: partnerChatRoom,
            });
            setLoading(false);
        }catch(error){
            console.log(error)
        }
         
    }

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
        startChat,
        response,
        loading,
    };
};
