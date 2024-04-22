import { configureStore } from '@reduxjs/toolkit';
import chatRoomReducer from './chatRoomSlice';
import marketColelctionReducer from './marketCollectionSlice'
import jobCollectionReducer from './jobCollectionSlice'
import itemReducer from './ItemSlice'
import houseCollectionReducer from './houseCollectionSilce'
import communityCollectionReducer from './communityCollectionSlice';

export const store = configureStore({
  reducer: {
    openChatRoom: chatRoomReducer,
    marketCollection: marketColelctionReducer,
    itemInRedux: itemReducer,
    jobCollection: jobCollectionReducer,
    houseCollection: houseCollectionReducer,
    communityCollection: communityCollectionReducer
  },
});

export default store;