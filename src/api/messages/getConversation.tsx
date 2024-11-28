'use client'

import NotFound from "@/app/not-found"
import { addConversation } from "@/redux/features/messages/messageSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"

const useGetConversation = ()=> {
    
    const token = useAppSelector(state => state.auth.token)
    const dispatch = useAppDispatch()

    const getConversation = async (id: string) => {
        try {
            const response = await axs.get(`/message/get-conversation/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = response.data
            dispatch(addConversation(data))
        } catch (error) {
            console.log(error)
            return <NotFound />
        }
    }
    return {getConversation}
}

export default useGetConversation