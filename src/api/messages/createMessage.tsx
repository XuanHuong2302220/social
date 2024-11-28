'use client'

import { addMessage } from "@/redux/features/messages/messageSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"

interface CreateMessage {
    content: string,
    conversationId: string
}

const useCreateMessage = ()=> {
    const [loading, setLoading] = useState(false)
    const token = useAppSelector(state => state.auth.token)
    const dispatch = useAppDispatch()

    const createMessage = async (data: CreateMessage) => {
        setLoading(true)
        try {
            const response = await axs.post('/message/create-message',data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })

            const message = await response.data
            dispatch(addMessage({id: message.idConversation, message: message}))
           
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }
    return {loading, createMessage}
}

export default useCreateMessage