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
    avatar: null,
    dob: null,
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
        }
    },
})

export const { setUser, cleaerUser } = userSlice.actions

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer