import { PostState } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store"

interface Post {
    posts: PostState[];
}

const initialPostState : Post = {
    posts: []
}


const postSlice = createSlice({
    name: 'post',
    initialState: initialPostState,
    reducers: {
        addPost: (state, action: PayloadAction<PostState>) => {
            state.posts = [...state.posts, action.payload]
        }
    }
})

export const { addPost } = postSlice.actions
export const selectPost = (state: RootState) => state.post
export default postSlice.reducer