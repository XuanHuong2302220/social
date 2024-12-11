'use client'

import { addMessage } from "@/redux/features/messages/messageSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import useSocket from "@/socket/socket"
import { useEffect, useState } from "react"
import soundMessage from '@/assets/sound/notification.wav'
import { selectUser } from "@/redux/features/user/userSlice"

interface CreateMessage {   
    content: string,
    idConversation: string,
    senderId: string,
}

const useCreateMessage = ()=> {
    const [loading, setLoading] = useState(false)
    const socket = useSocket('messages')
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser)

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
        const message = {
            id: Math.random().toString(),
            content: data.content,
            created_ago: 'Just now',
            sender: {
                id: data.senderId,
                fullName: 'Sender Full Name',
                avatar: user.avatar,
                username: 'Sender Username'
            },
            receiver: {
                id: '1',
                fullName: 'Receiver Full Name',
                avatar: 'Receiver Avatar URL',
                username: 'Receiver Username'
            },
            idConversation: data.idConversation
        }
        try {
            if(socket){
                socket.emit('sendMessage', {
                    ...data,
                    conversationId: data.idConversation
                })
            }
            dispatch(addMessage({id: data.idConversation, message}))
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