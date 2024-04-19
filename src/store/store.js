import { configureStore } from '@reduxjs/toolkit';
import chatRoomReducer from './chatRoomSlice';
import marketColelctionReducer from './marketCollectionSlice'


export const store = configureStore({
  reducer: {
    openChatRoom: chatRoomReducer,
    marketCollection: marketColelctionReducer
  },
});

export default store;