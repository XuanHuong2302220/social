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
            const newComments = action.payload.filter(newComment =>{
                return !state.comments.some(existingComment => existingComment.id === newComment.id)
            })

            state.comments = [...state.comments, ...newComments]
        },
        addComment : (state, action : PayloadAction<Comment>) => {
            state.comments = [action.payload, ...state.comments]
        }
    }
})

export const {addComments, addComment} = commentSlice.actions
export default commentSlice.reducer