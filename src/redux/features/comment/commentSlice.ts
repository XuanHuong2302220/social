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
            state.comments[index] = action.payload 
            console.log(action.payload)
        },
        deleteComment : (state, action : PayloadAction<string>) => {
            state.comments = state.comments.filter(comment => comment.id !== action.payload)
        }
        
    }
})

export const {addComments,addComment, updateComment, deleteComment} = commentSlice.actions
export default commentSlice.reducer