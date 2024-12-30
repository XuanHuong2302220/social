'use client'

import NotFound from "@/app/not-found"
import { addConversation, addMessConversation } from "@/redux/features/messages/messageSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { Conversation } from "@/types"
import axs from "@/utils/axios"
import {useState } from "react"

const useGetConversation = ()=> {
    
    const token = useAppSelector(state => state.auth.token)
    const dispatch = useAppDispatch()
    const [conversation, setConversation] = useState<Conversation>()

    const getConversation = async (id: string, isMess?: boolean) => {
        try {
            const response = await axs.get(`/message/get-conversation/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = response.data
            setConversation(data)
            if(isMess){
                addMessConversation(data)
                console.log(data)
            }
            else
            dispatch(addConversation(data))
        } catch (error) {
            console.log(error)
            return <NotFound />
        }
    }
    return {getConversation, conversation}
}

export default useGetConversation