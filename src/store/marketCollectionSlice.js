import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    marketItems: [],
};

const marketCollectionSlice = createSlice({
    name: 'marketCollection',
    initialState: initialState,
    reducers: {
        plusInterest(state, action) {
            const index = state.marketItems.findIndex(
                (item) => item.id == action.payload.item.id
            );
            if (index != -1) {
                console.log('Hello add');
                const updatedCollection = state.marketItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    interests: updatedCollection[index].interests + 1,
                };
                state.marketItems = updatedCollection;
            }
        },

        minusInterest(state, action) {
            const index = state.marketItems.findIndex(
                (item) => item.id == action.payload.item.id
            );
            if (index != -1) {
                console.log('Hello delete');

                const updatedCollection = state.marketItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    interests: updatedCollection[index].interests - 1,
                };
                state.marketItems = updatedCollection;
            }
        },

        addCommentOnCollection(state, action) {
            const index = state.marketItems.findIndex(
                (item) => item.id == action.payload.itemId
            );
            if (index !== -1) {
                state.marketItems[index].numOfComment =
                    state.marketItems[index].numOfComment + 1;
            }
        },

        deleteCommentOnCollection(state, action) {
            const index = state.marketItems.findIndex(
                (item) => item.id == action.payload.itemId
            );
            if (index !== -1) {
                state.marketItems[index].numOfComment =
                    state.marketItems[index].numOfComment -
                    action.payload.numOfReply;
            }
        },

        deleteItemFromRedux(state, action) {
            const index = state.marketItems.findIndex(
                (item) => item.id === action.payload.id
            );
            if (index !== -1) {
                state.marketItems.splice(index, 1);
            }
        },
        addItem(state, action) {
            state.marketItems = [action.payload, ...state.marketItems];
        },
        fetchCollection(state, action) {
            state.marketItems = action.payload.documents;
        },
    },
});

export const {
    plusInterest,
    minusInterest,
    addCommentOnCollection,
    deleteCommentOnCollection,
    addItem,
    deleteItemFromRedux,
    fetchCollection,
} = marketCollectionSlice.actions;
export default marketCollectionSlice.reducer;
