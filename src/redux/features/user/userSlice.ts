import { createSlice } from "@reduxjs/toolkit"
import { UserState } from "@/types"

const initialState: UserState = {
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
        setUser: (state, action) => {
            state.username = action.payload.username
            state.firstName = action.payload.firstName
            state.lastName = action.payload.lastName,
            state.email = action.payload.email,
            state.avatar = action.payload.avatar
            state.gender = action.payload.gender
            state.dob = action.payload.dob
        }
    }
})

export const { setUser } = userSlice.actions

export const selectUser = (state: any) => state.user

export default userSlice.reducer