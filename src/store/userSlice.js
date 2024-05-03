import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: undefined,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        fetchUser(state, action) {
            state.user = action.payload.user;
        },
    },
});

export const { fetchUser } = userSlice.actions;

export default userSlice.reducer;
