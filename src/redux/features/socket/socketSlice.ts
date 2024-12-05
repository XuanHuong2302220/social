import { UserProps } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    userOnline: [] as UserProps[],
}

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setUserOnline: (state, action: PayloadAction<UserProps[]>) => {
            state.userOnline = action.payload
        },
        addUserOnline: (state, action: PayloadAction<UserProps>) => {
            const userExists = state.userOnline.find(user => user.id === action.payload.id);
            if (!userExists) {
                state.userOnline.push(action.payload);
            }
        },
    }
})

export const { setUserOnline, addUserOnline } = socketSlice.actions

export default socketSlice.reducer