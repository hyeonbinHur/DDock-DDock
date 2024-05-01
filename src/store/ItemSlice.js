import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    item: null,
    writer: null,
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

            state.item.numOfComment = state.item.numOfComment + 1;
        },
        deleteCommentOnItem(state, action) {
            const index = state.item.comments.findIndex(
                (comment) => comment.id == action.payload.id
            );
            if (index !== -1) {
                state.item.comments.splice(index, 1);
                state.item.numOfComment = state.item.numOfComment - 1;
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
        addReplyOnItem(state, action) {
            const commentIndex = state.item.comments.findIndex(
                (comment) => comment.id === action.payload.commentId
            );
            if (commentIndex !== -1) {
                state.item.comments[commentIndex].childComment = [
                    ...state.item.comments[commentIndex].childComment,
                    action.payload.reply,
                ];
                state.item.numOfComment = state.item.numOfComment + 1;
            }
        },
        delteReplyOnItem: (state, action) => {
            const { replyId, commentId } = action.payload;
            const commentIndex = state.item.comments.findIndex(
                (c) => c.id === commentId
            );
            if (commentIndex !== -1) {
                const comment = state.item.comments[commentIndex];
                const replyIndex = comment.childComment.findIndex(
                    (r) => r.id === replyId
                );
                if (replyIndex !== -1) {
                    comment.childComment.splice(replyIndex, 1);
                }
                state.item.numOfComment = state.item.numOfComment - 1;
            }
        },
        updateReplyOnItem(state, action) {
            const commentIndex = state.item.comments.findIndex(
                (comment) => comment.id === action.payload.commentId
            );
            if (commentIndex != -1) {
                const index = state.item.comments[
                    commentIndex
                ].childComment.findIndex(
                    (reply) => reply.id == action.payload.reply.id
                );
                if (index != -1) {
                    const updatedReply =
                        state.item.comments[commentIndex].childComment;
                    updatedReply[index] = action.payload.reply;
                    state.item.comments[commentIndex].childComment =
                        updatedReply;
                }
            }
        },
        readItem(state, action) {
            const item = action.payload.item;

            const serializedItem = {
                title: item.title,
                conditions: item.conditions,
                description: item.description,
                comments: item.comments,
                images: item.images,
                bucket: item.bucket,
                location: item.location,
                createdAt: item.createdAt,
                userId: item.userId,
                type: item.type,
                interests: item.interests,
                numOfComment: item.numOfComment,
            };
            state.item = serializedItem;
        },

        readWriter(state, action) {
            const writer = action.payload.writer;

            const serializedUserItem = writer.userItem.map((item) => ({
                title: item.title,
                conditions: item.conditions,
                description: item.description,
                comments: item.comments,
                images: item.images,
                bucket: item.bucket,
                location: item.location,
                createdAt: item.createdAt,
                userId: item.userId,
                type: item.type,
                interests: item.interests,
                numOfComment: item.numOfComment,
            }));

            const serializedItem = {
                uid: writer.uid,
                displayName: writer.displayName,
                userItem: serializedUserItem,
                userComment: writer.userComment,
                Avatar: writer.Avatar,
                setDisplayName: writer.setDisplayName,
                email: writer.email,
                interests: writer.interests,
                location: writer.location,
                chatRoom: writer.chatRoom,
                unread: writer.unread,
                MItem: writer.MItem,
                CItem: writer.CItem,
                JItem: writer.JItem,
                HItem: writer.HItem,
            };
            state.writer = serializedItem;
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
    readWriter,
} = itemSlice.actions;

export default itemSlice.reducer;
