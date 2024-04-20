import {createSlice} from '@reduxjs/toolkit'

const initialState = { 
    item:null
}

const itemSlice = createSlice({
    name: 'item',
    initialState: initialState,

    reducers: {
        addCommentOnItem(){
            console.log("hello add comment");
        },
        deleteCommentOnItem(){

        },
        updateCommentOnItem(){

        },
        addReplyOnItem(){

        },
        delteReplyOnItem(){

        },
        updateReplyOnItem(){

        },
        readItem(state, action){
            state.item = action.payload.item
        }

    }
})

export const {
    addCommentOnItem,
    deleteCommentOnItem,
    updateCommentOnItem,
    addReplyOnItem,
    delteReplyOnItem,
    updateReplyOnItem,
    readItem
} = itemSlice.actions;

export default itemSlice.reducer;