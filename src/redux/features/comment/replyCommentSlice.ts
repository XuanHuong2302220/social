
import { Comment } from "@/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"


const initialReplyComment = {
    comments: [] as Comment[],
}

const replyCommentSlice = createSlice({
    name: 'replyComment',
    initialState: initialReplyComment,
    reducers: {
        addReplyComments : (state, action : PayloadAction<Comment[]>) => {
            state.comments = [...action.payload]
        },
        addreplyComment : (state, action : PayloadAction<Comment>) => {
            state.comments = [action.payload, ...state.comments]
        },
        updateReplyComment: (state, action : PayloadAction<Comment>) => {
            const index = state.comments.findIndex(comment => comment.id === action.payload.id)
            state.comments[index] = { ...state.comments[index], ...action.payload }
        },
        deleteReplyComment : (state, action : PayloadAction<string>) => {
            state.comments = state.comments.filter(comment => comment.id !== action.payload)
        },
        increaLikeReplyComment: (state, action: PayloadAction<{commentId: string}>) => {
            const comment = state.comments.find(comment => comment.id === action.payload.commentId)
            if(comment) {
                comment.reactionCount += 1
            }
        },
        decreaLikeReplyComment: (state, action: PayloadAction<{commentId: string}>) => {
            const comment = state.comments.find(comment => comment.id === action.payload.commentId)
            if(comment) {
                comment.reactionCount -= 1
            }
        }      
    }
})

export const {addReplyComments,addreplyComment, updateReplyComment, deleteReplyComment, increaLikeReplyComment,decreaLikeReplyComment} = replyCommentSlice.actions
export default replyCommentSlice.reducer