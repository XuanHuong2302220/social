import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserState } from "@/types"
import { RootState } from "@/redux/store"

const initialState: UserState = {
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    gender: null,
    email: "",
    postCount: 0,
    followers: 0,
    followings: 0,
    avatar: null,
    dob: null,
    isFollow: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<Partial<UserState>>) => {
            return { ...state, ...action.payload };
        },
        cleaerUser: ()=> {
            return { ...initialState }
        },
        setAttributes: (state, action: PayloadAction<UserState>) => {
            return { ...state, ...action.payload }
        }
    },
})

export const { setUser, cleaerUser,setAttributes } = userSlice.actions

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer