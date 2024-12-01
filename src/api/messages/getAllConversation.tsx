'use client'

import { setConversations } from "@/redux/features/messages/messageSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"
import { Conversation } from "@/types"

const useGetAllConversation = () => {

    const token = useAppSelector(state => state.auth.token)
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)

    const getAllConversation = async () => {

        setLoading(true)
        try {
            const response = await axs.get('/message/get-all-conversation', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const {data} = await response.data
            console.log(data)
            const dataFilter = data.filter((conversation: Conversation) => conversation.lastMessage)
            console.log(dataFilter)
            dispatch(setConversations(dataFilter))
            
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }
    return { loading, getAllConversation }
}

export default useGetAllConversation