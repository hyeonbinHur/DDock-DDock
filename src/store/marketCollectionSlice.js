import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    marketItems: [],
};

const marketCollectionSlice = createSlice({
    name: 'marketCollection',
    initialState: initialState,
    reducers: {

        plusInterest(state, action) {
            const index = state.marketItems.findIndex(item => item.id == action.payload.id);
            if(index !== -1){
                const updatedCollection = state.marketItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    interests: updatedCollection[index].interests + 1
                }

                state.marketItems = updatedCollection;
            }
        },
        minusInterest(state, action) {
            const index = state.marketItems.findIndex(item => item.id == action.payload.id);
            if(index !== -1){
                const updatedCollection = state.marketItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    interests: updatedCollection[index].interests - 1
                }

                state.marketItems = updatedCollection;
            }
        },


        addComment() {},
        deleteComment() {},



        deleteItemFromRedux(state, action) {
            console.log("딜리트 시작")
            console.log(state.marketItems.length);

            const index = state.marketItems.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.marketItems.splice(index, 1);
            }
            console.log("딜리트 끝")
            console.log(state.marketItems.length);


        },
        addItem(state , action) {
            state.marketItems = [action.payload, ...state.marketItems];
        },
        fetchCollection(state, action) {
            state.marketItems = action.payload.documents
        },
    },
});

export const {
    plusInterest,
    minusInterest,
    addComment,
    deleteComment,
    addItem,
    deleteItemFromRedux,
    fetchCollection,
} = marketCollectionSlice.actions;
export default marketCollectionSlice.reducer;
