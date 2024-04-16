import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    openChatRoom: false,
    roomId: null,
    partnerId: null,
};

const chatRoomSlice = createSlice({
    name: 'openChatRoom',
    initialState: initialState,
    reducers: {
        open(state, action){
            state.openChatRoom = true;
            state.roomId = action.payload.roomId;
            state.partnerId = action.payload.partner;
        },
        close(state){
            state.openChatRoom = false;
        },
        set(state ,action){
            state.roomId = action.payload.roomId;
        }
    },
});

export const { open, close, set } = chatRoomSlice.actions;
export default chatRoomSlice.reducer;
