import { PostState } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store"

interface Post {
    posts: PostState[];
    currentPage: number;
    hasMore: boolean;
    loading: boolean;
}

const initialPostState : Post = {
    posts: [],
    currentPage: 1,
    hasMore: true,
    loading: false,
}


const postSlice = createSlice({
    name: 'post',
    initialState: initialPostState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        addPosts: (state, action: PayloadAction<PostState[]>) => {
            const newPosts = action.payload.filter(newPost => 
                !state.posts.some(existingPost => existingPost.id === newPost.id)
            );
            state.posts = [...state.posts, ...newPosts];
        },
        addPost: (state, action: PayloadAction<PostState>) => {
            state.posts = [action.payload, ...state.posts];
            console.log(state.posts)
        },
        editPost: (state, action: PayloadAction<PostState>) => {
            const index = state.posts.findIndex(post => post.id === action.payload.id);
            if (index !== -1) {
                state.posts[index] = action.payload;
            }
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setHasMore: (state, action) => {
        state.hasMore = action.payload;
        },
        setLoading: (state, action) => {
        state.loading = action.payload;
        }, 
    }
})

export const {  setPosts, addPosts, setCurrentPage, setHasMore, setLoading, addPost, editPost  } = postSlice.actions
export const selectPost = (state: RootState) => state.post
export default postSlice.reducer