import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    marketItems: [],
};

const marketCollectionSlice = createSlice({
    name: 'marketCollection',
    initialState: initialState,
    reducers: {
        plusInterest() {},
        minuseInterest() {},
        addComment() {},
        deleteComment() {},
        addItem() {},
        deleteItem() {},
        fetchCollection(state, action) {
            state.marketItems = action.payload.documents
        },
    },
});

export const {
    plusInterest,
    minuseInterest,
    addComment,
    deleteComment,
    addItem,
    deleteItem,
    fetchCollection,
} = marketCollectionSlice.actions;
export default marketCollectionSlice.reducer;
