'use client'

import { addConversation, addMessage } from "@/redux/features/messages/messageSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import useSocket from "@/socket/socket"
import { useEffect, useState } from "react"
import soundMessage from '@/assets/sound/notification.wav'

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
                const sound = new Audio(soundMessage)
                sound.play()
                dispatch(addMessage({id: message.idConversation, message}))
            })
        }

        return ()=> {socket?.off('messageCreated')}

    }, [socket, dispatch])

    const createMessage = async ( data: CreateMessage) => {
        setLoading(true)
        try {
            if(socket){
                socket.emit('sendMessage', data)
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