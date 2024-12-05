import { PostState } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store"

interface Post {
    posts: PostState[];
    currentPage: number;
    hasMore: boolean;
    loading: boolean;
}

const initialPostState: Post = {
    posts: [],
    currentPage: 1,
    hasMore: false,
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
            // state.posts = [...action.payload, ...state.posts];

        },
        addPost: (state, action: PayloadAction<PostState>) => {
            state.posts = [action.payload, ...state.posts];
        },
        editPost: (state, action: PayloadAction<PostState>) => {
            const index = state.posts.findIndex(post => post.id === action.payload.id);
            if (index !== -1) {
                state.posts[index] = action.payload;
            }
        },
        increaLike: (state, action: PayloadAction<{ postId: number }>) => {
            const post = state.posts.find(post => post.id === action.payload.postId);
            if (post) {
                post.reaction_count += 1;
            }
        },
        decreaseLike: (state, action: PayloadAction<{ postId: number }>) => {
            const post = state.posts.find(post => post.id === action.payload.postId);
            if (post) {
                post.reaction_count -= 1;
            }
        },
        deletePost: (state, action: PayloadAction<{ postId: number }>) => {
            state.posts = state.posts.filter(post => post.id !== action.payload.postId);
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
        setCountComment: (state, action: PayloadAction<{ postId: number }>) => {
            const post = state.posts.find(post => post.id === action.payload.postId);
            if (post) {
                post.comment_count += 1;
            }
        },
        decreaCountComment: (state, action: PayloadAction<{ postId: number }>) => {
            const post = state.posts.find(post => post.id === action.payload.postId);
            if (post) {
                post.comment_count -= 1;
            }
        },
        changeTypeReaction: (state, action: PayloadAction<{ postId: number, type: string }>) => {
            console.log(action.payload);
            const post = state.posts.find(post => post.id === action.payload.postId);
            if (post) {
                console.log(action.payload.type);
                post.reactionType = action.payload.type;
            }
        }
    }
})

export const { setPosts, addPosts, setCurrentPage, setHasMore, setLoading, addPost, editPost, increaLike, decreaseLike, deletePost, setCountComment, decreaCountComment, changeTypeReaction } = postSlice.actions
export const selectPost = (state: RootState) => state.post
export default postSlice.reducer