import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    item: null,
};

const itemSlice = createSlice({
    name: 'item',
    initialState: initialState,

    reducers: {
        addCommentOnItem(state, action) {
            // console.log("hello add comment");
            state.item.comments = [
                action.payload.comment,
                ...state.item.comments,
            ];
        },
        deleteCommentOnItem(state, action) {
            const index = state.item.comments.findIndex(
                (comment) => comment.id == action.payload.id
            );
            if (index !== -1) {
                state.item.comments.splice(index, 1);
            }
        },
        updateCommentOnItem(state, action) {
            const index = state.item.comments.findIndex(
                (comment) => comment.id == action.payload.comment.id
            );
            if (index != -1) {
                const updatedComment = state.item.comments;
                updatedComment[index] = action.payload.comment;
                state.item.comments = updatedComment;
            }
        },
        addReplyOnItem() {},
        delteReplyOnItem() {},
        updateReplyOnItem() {},
        readItem(state, action) {
            state.item = action.payload.item;
        },
    },
});

export const {
    addCommentOnItem,
    deleteCommentOnItem,
    updateCommentOnItem,
    addReplyOnItem,
    delteReplyOnItem,
    updateReplyOnItem,
    readItem,
} = itemSlice.actions;

export default itemSlice.reducer;
