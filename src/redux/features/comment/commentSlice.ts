import { Comment } from "@/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialComment = {
    comments: [] as Comment[],
    currentPage: 1,
    hasMore: true,
}

const commentSlice = createSlice({
    name: 'comment',
    initialState: initialComment,
    reducers: {
        addComments: (state, action: PayloadAction<Comment[]>) => {
            const newComments = action.payload.filter(newComment =>
                !state.comments.some(existingPost => existingPost.id === newComment.id)
            );
            state.comments = [...state.comments, ...newComments];
        },
        addComment: (state, action: PayloadAction<Comment>) => {
            const index = state.comments.findIndex(comment => comment.id === action.payload.id)
            if (index !== -1) {
                state.comments[index] = { ...state.comments[index], ...action.payload }
                return
            }
            state.comments = [action.payload, ...state.comments]
        },
        updateComment: (state, action: PayloadAction<Comment>) => {
            const index = state.comments.findIndex(comment => comment.id === action.payload.id)
            state.comments[index] = { ...state.comments[index], ...action.payload }
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload
        },
        setHasMore: (state, action: PayloadAction<boolean>) => {
            state.hasMore = action.payload
        },
        clearComments: (state) => {
            state.comments = []
        },
        deleteComment: (state, action: PayloadAction<string>) => {
            state.comments = state.comments.filter(comment => comment.id !== action.payload)
        },
        increaLikeComment: (state, action: PayloadAction<{ commentId: string, parentId?: string }>) => {
            if (action.payload.parentId) {
                const comment = state.comments.find(comment => comment.id === action.payload.parentId)
                if (comment) {
                    const parent = comment.children.find(comment => comment.id === action.payload.commentId)
                    if (parent) {
                        parent.reactionCount += 1
                    }
                }
            }
            else {
                const comment = state.comments.find(comment => comment.id === action.payload.commentId)
                if (comment) {
                    comment.reactionCount += 1
                }
            }
        },
        decreaLikeComment: (state, action: PayloadAction<{ commentId: string, parentId?: string }>) => {
            if (action.payload.parentId) {
                const comment = state.comments.find(comment => comment.id === action.payload.parentId)
                if (comment) {
                    const parent = comment.children.find(comment => comment.id === action.payload.commentId)
                    if (parent) {
                        parent.reactionCount -= 1
                    }
                }
            }
            else {
                const comment = state.comments.find(comment => comment.id === action.payload.commentId)
                if (comment) {
                    comment.reactionCount -= 1
                }
            }
        },
        addReplyComments: (state, action: PayloadAction<{ commentId: string, replyComments: Comment[] }>) => {
            const comment = state.comments.find(comment => comment.id === action.payload.commentId)
            if (comment) {
                comment.children = action.payload.replyComments.reverse()
            }
        },
        addReplyComment: (state, action: PayloadAction<{ parentId: string, commentId: string, replyComment: Comment }>) => {
            const comment = state.comments.find(comment => comment.id === action.payload.parentId)
            if (comment) {
                if (comment) {
                    if (!Array.isArray(comment.children)) {
                        comment.children = [];
                    }
                    comment.children.push(action.payload.replyComment)
                }
            }
        },
        updateReplyComment: (state, action: PayloadAction<{ commentId: string, parentId: string, replyComment: Comment }>) => {
            const comment = state.comments.find(comment => comment.id === action.payload.parentId)
            if (comment) {
                const id = comment.children.findIndex(comment => comment.id === action.payload.commentId)
                comment.children[id] = action.payload.replyComment
            }
        },
        deleteReplyComment: (state, action: PayloadAction<{ commentId: string, parentId: string }>) => {
            const comment = state.comments.find(comment => comment.id === action.payload.parentId)
            if (comment) {
                comment.children = comment.children.filter(comment => comment.id !== action.payload.commentId)
            }
        },
        increaCountComment: (state, action: PayloadAction<{ parentId: string }>) => {
            const comment = state.comments.find(comment => comment.id === action.payload.parentId)
            if (comment) {
                comment.commentCount += 1
            }
        },
    }
})

export const { addComments, addComment, updateComment, deleteComment, setCurrentPage, setHasMore, increaLikeComment, decreaLikeComment, clearComments, addReplyComments, addReplyComment, updateReplyComment, deleteReplyComment, increaCountComment } = commentSlice.actions
export default commentSlice.reducer