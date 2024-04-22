import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    communityItems: [],
};
const communityCollectionSlice = createSlice({
    name: 'communityCollection',
    initialState,
    reducers: {
        fetchCollection(state, action) {
            state.communityItems = action.payload.collection;
        },
        deleteCommunityItem(state, action) {
            const index = state.communityItems.forEach(
                (item) => item.id == action.payload.id
            );
            if (index != -1) {
                state.communityItems.splice(index, 1);
            }
        },
        addCommunityItem(state, action) {
            state.communityItems = [
                action.payload.item,
                ...state.communityItems,
            ];
        },
        addCommentOnCCollection(state, action) {
            const index = state.communityItems.findIndex(
                (item) => item.id == action.payload.item.id
            );
            if (index != -1) {
                const updatedCollection = state.communityItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    numOfComment: updatedCollection[index].numOfComment + 1,
                };
                state.communityItems = updatedCollection;
            }
        },
        deleteCommentOnCCollection(state, action) {
            const index = state.communityItems.findIndex(
                (item) => item.id == action.payload.item.id
            );
            if (index != -1) {
                const updatedCollection = state.communityItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    numOfComment:
                        updatedCollection[index].numOfComment -
                        action.payload.numOfReply,
                };
                state.communityItems = updatedCollection;
            }
        },
        plusInteresOnCCollection(state, action) {
            const index = state.communityItems.findIndex(
                (item) => item.id == action.payload.item.id
            );
            if (index != -1) {
                console.log('Hello add');
                const updatedCollection = state.communityItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    interests: updatedCollection[index].interests + 1,
                };
                state.communityItems = updatedCollection;
            }
        },
        minusInterestOnCCollection(state, action) {
            const index = state.communityItems.findIndex(
                (item) => item.id == action.payload.item.id
            );
            if (index != -1) {
                console.log('Hello delete');

                const updatedCollection = state.communityItems;
                updatedCollection[index] = {
                    ...updatedCollection[index],
                    interests: updatedCollection[index].interests - 1,
                };
                state.communityItems = updatedCollection;
            }
        },
    },
});

export const {
    fetchCollection,
    deleteCommunityItem,
    addCommunityItem,
    addCommentOnCCollection,
    deleteCommentOnCCollection,
    plusInteresOnCCollection,
    minusInterestOnCCollection,
} = communityCollectionSlice.actions;

export default communityCollectionSlice.reducer;
