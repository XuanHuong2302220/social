'use client'

import { addConversation, addMessage } from "@/redux/features/messages/messageSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import useSocket from "@/socket/socket"
import { useEffect, useState } from "react"
import useGetConversation from "./getConversation"

interface CreateMessage {
    content: string,
    conversationId: string,
    senderId: string,
}

const useCreateMessage = ()=> {
    const [loading, setLoading] = useState(false)
    const socket = useSocket('messages')
    const dispatch = useAppDispatch()

    useEffect(()=> {
        if(socket){
            socket.on('messageCreated', (message)=> {
                dispatch(addMessage({id: message.idConversation, message}))
            })
            socket.on('conversationData', (conversation)=> {
                console.log(conversation, 'conversation')
                dispatch(addConversation(conversation))
            })
        }

        return ()=> {socket?.off('messageCreated')}

    }, [socket, dispatch])

    const createMessage = async ( data: CreateMessage) => {
        setLoading(true)
        try {
            if(socket){
                socket.emit('sendMessage', data)
                socket.emit('getConversation', {conversationId: data.conversationId})
            }
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }
    return {loading, createMessage}
}

export default useCreateMessage