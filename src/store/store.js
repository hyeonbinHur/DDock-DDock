import { configureStore } from '@reduxjs/toolkit';
import chatRoomReducer from './chatRoomSlice';
import marketColelctionReducer from './marketCollectionSlice'
import jobCollectionReducer from './jobCollectionSlice'
import itemReducer from './ItemSlice'


export const store = configureStore({
  reducer: {
    openChatRoom: chatRoomReducer,
    marketCollection: marketColelctionReducer,
    itemInRedux: itemReducer,
    jobCollection: jobCollectionReducer
    
  },
});

export default store;