import { Notification } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initalNoti = {
    notifications: [] as Notification[],
}

const notifySlice = createSlice({
    name: 'notification',
    initialState: initalNoti,
    reducers: {
        setNotifications: (state, action)=> {
            state.notifications = action.payload
        }
    }
})

export const { setNotifications } = notifySlice.actions
export default notifySlice.reducer