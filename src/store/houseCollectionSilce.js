import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    houseItems: [],
};

const houseCollectionSlice = createSlice({
    name: 'houseCollection',
    initialState,
    reducers: {
        fetchCollection(state, action) {
            state.houseItems = action.payload.collection;
        },
        deleteHouseItem(state, action) {
            const index = state.houseItems.forEach(
                (item) => item.id == action.payload.id
            );
            if (index != -1) {
                state.houseItems.splice(index, 1);
            }
        },
        addHouseItem(state, action) {
            state.houseItems = [action.payload.item, ...state.houseItems];
        },
        addCommentOnHCollection(state, action) {
            const index = state.houseItems.findIndex(
                (item) => item.id == action.payload.item.id
            );
            if (index != -1) {
                const updatedCollection = state.houseItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    numOfComment: updatedCollection[index].numOfComment + 1,
                };
                state.houseItems = updatedCollection;
            }
        },
        deleteCommentOnHCollection(state, action) {
            const index = state.houseItems.findIndex(
                (item) => item.id == action.payload.item.id
            );
            if (index != -1) {
                const updatedCollection = state.houseItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    numOfComment:
                        updatedCollection[index].numOfComment -
                        action.payload.numOfReply,
                };
                state.houseItems = updatedCollection;
            }
        },
        plusInteresOnHCollection(state, action) {
            const index = state.houseItems.findIndex(
                (item) => item.id == action.payload.item.id
            );
            if (index != -1) {
                console.log('Hello add');
                const updatedCollection = state.houseItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    interests: updatedCollection[index].interests + 1,
                };
                state.houseItems = updatedCollection;
            }
        },
        minusInterestOnHCollection(state, action) {
            const index = state.houseItems.findIndex(
                (item) => item.id == action.payload.item.id
            );
            if (index != -1) {
                console.log('Hello delete');

                const updatedCollection = state.houseItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    interests: updatedCollection[index].interests - 1,
                };
                state.houseItems = updatedCollection;
            }
        },

        updateItemInCollection(state, action) {
            const updatedItem = action.payload.item;
            const id = action.payload.id;

            const index = state.houseItems.findIndex((item) => item.id === id);

            if (index !== -1) {
                state.houseItems[index] = updatedItem;
            }
        },
    },
});

export const {
    fetchCollection,
    addHouseItem,
    addCommentOnHCollection,
    deleteCommentOnHCollection,
    plusInteresOnHCollection,
    minusInterestOnHCollection,
    deleteHouseItem,
    updateItemInCollection,
} = houseCollectionSlice.actions;

export default houseCollectionSlice.reducer;
