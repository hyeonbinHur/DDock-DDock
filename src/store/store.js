import { configureStore } from '@reduxjs/toolkit';
import chatRoomReducer from './chatRoomSlice';
import marketColelctionReducer from './marketCollectionSlice'
import itemReducer from './ItemSlice'


export const store = configureStore({
  reducer: {
    openChatRoom: chatRoomReducer,
    marketCollection: marketColelctionReducer,
    itemInRedux: itemReducer
  },
});

export default store;