import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    jobItems: [],
};

const jobCollectionSlice = createSlice({
    name: 'jobCollection',
    initialState: initialState,
    reducers: {
        fetchCollection(state, action) {
            state.jobItems = action.payload.collection;
        },
        deleteJobItem(state, action) {
            const index = state.jobItems.forEach(
                (item) => item.id == action.payload.id
            );
            if (index != -1) {
                state.jobItems.splice(index, 1);
            }
        },
        addJobItem(state, action) {
            state.jobItems = [action.payload.item, ...state.jobItems];
        },
        addCommentOnJCollection(state, action) {
            const index = state.jobItems.findIndex(
                (item) => item.id == action.payload.item.id
            );
            if (index != -1) {
                const updatedCollection = state.jobItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    numOfComment: updatedCollection[index].numOfComment + 1,
                };
                state.jobItems = updatedCollection;
            }
        },
        deleteCommentOnJCollection(state, action) {
            const index = state.jobItems.findIndex(
                (item) => item.id == action.payload.item.id
            );
            if (index != -1) {
                const updatedCollection = state.jobItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    numOfComment:
                        updatedCollection[index].numOfComment -
                        action.payload.numOfReply,
                };
                state.jobItems = updatedCollection;
            }
        },
        plusInteresOnJCollection(state, action) {
            const index = state.jobItems.findIndex(
                (item) => item.id == action.payload.item.id
            );
            if (index != -1) {
                console.log('Hello add');
                const updatedCollection = state.jobItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    interests: updatedCollection[index].interests + 1,
                };
                state.jobItems = updatedCollection;
            }
        },
        minusInterestOnJCollection(state, action) {
            const index = state.jobItems.findIndex(
                (item) => item.id == action.payload.item.id
            );
            if (index != -1) {
                console.log('Hello delete');

                const updatedCollection = state.jobItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    interests: updatedCollection[index].interests - 1,
                };
                state.jobItems = updatedCollection;
            }
        },

        updateItemInCollection(state, action) {
            const updatedItem = action.payload.item;
            const id = action.payload.id;

            const index = state.jobItems.findIndex((item) => item.id === id);

            if (index !== -1) {
                state.jobItems[index] = updatedItem;
            }
        },
    },
});

export const {
    fetchCollection,
    addJobItem,
    addCommentOnJCollection,
    deleteCommentOnJCollection,
    plusInteresOnJCollection,
    minusInterestOnJCollection,
    deleteJobItem,
    updateItemInCollection,
} = jobCollectionSlice.actions;
export default jobCollectionSlice.reducer;
