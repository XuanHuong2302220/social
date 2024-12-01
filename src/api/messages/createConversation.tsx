'use client'

import { addConversation } from "@/redux/features/messages/messageSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"


const useCreateConversation = () => {

    const [loading, setLoading] = useState(false)
    const token = useAppSelector(state => state.auth.token)
    const dispatch = useAppDispatch()
    
    const createConversation = async (receiverId: string) => {
        setLoading(true)
        try {
            const response = await axs.post('/message/create-conversation', {
                receiverId: receiverId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.data

            dispatch(addConversation(data))
            
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }
    return { createConversation, loading }
}

export default useCreateConversation