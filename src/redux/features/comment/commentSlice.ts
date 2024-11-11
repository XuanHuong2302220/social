import { Comment } from "@/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"


const initialComment = {
    comments: [] as Comment[],
}

const commentSlice = createSlice({
    name: 'comment',
    initialState: initialComment,
    reducers: {
        addComments : (state, action : PayloadAction<Comment[]>) => {
            state.comments = [...action.payload]
        },
        addComment : (state, action : PayloadAction<Comment>) => {
            state.comments = [action.payload, ...state.comments]
        },
        updateComment: (state, action : PayloadAction<Comment>) => {
            const index = state.comments.findIndex(comment => comment.id === action.payload.id)
            state.comments[index] = { ...state.comments[index], ...action.payload }
        },
        deleteComment : (state, action : PayloadAction<string>) => {
            state.comments = state.comments.filter(comment => comment.id !== action.payload)
        },
        increaLikeComment: (state, action: PayloadAction<{commentId: string}>) => {
            const comment = state.comments.find(comment => comment.id === action.payload.commentId)
            if(comment) {
                comment.reactionCount += 1
            }
        },
        decreaLikeComment: (state, action: PayloadAction<{commentId: string}>) => {
            const comment = state.comments.find(comment => comment.id === action.payload.commentId)
            if(comment) {
                comment.reactionCount -= 1
            }
        }      
    }
})

export const {addComments,addComment, updateComment, deleteComment, increaLikeComment,decreaLikeComment} = commentSlice.actions
export default commentSlice.reducer