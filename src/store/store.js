import { configureStore } from '@reduxjs/toolkit';
import chatRoomReducer from './chatRoomSlice';


export const store = configureStore({
  reducer: {
    openChatRoom: chatRoomReducer,
  },
});

export default store;