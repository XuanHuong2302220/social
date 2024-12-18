'use client'

import {addMessage } from "@/redux/features/messages/messageSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import useSocket from "@/socket/socket"
import { useEffect, useState } from "react"
import soundMessage from '@/assets/sound/notification.wav'
import { selectUser } from "@/redux/features/user/userSlice"
import { Socket } from "socket.io-client"

interface CreateMessage {   
    content: string,
    idConversation: string,
    senderId: string
}

const useCreateMessage = (idConversation : string, userSocket?: Socket)=> {
    const [loading, setLoading] = useState(false)
    const socket = useSocket('messages')
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser)
    // const userSocket = useSocket('users')

    useEffect(()=> {
        if(socket){
            socket.emit('joinConversation', { conversationId: idConversation });
            socket.on('messageCreated', (message)=> {
                if(message.receiver.id === user.id) {
                    const sound = new Audio('/sound/notification.wav')
                    sound.play()
                }
                if(userSocket){
                    userSocket.emit('getConversation', {conversationId: message.idConversation, senderId: user.id})
                }
                dispatch(addMessage({id: message.idConversation, message}))
            })
        }

        return ()=> {socket?.off('messageCreated')}

    }, [socket, dispatch])

    const createMessage = async ( data: CreateMessage) => {
        setLoading(true)

        try {
            if(socket){
                socket.emit('sendMessage', {
                    ...data,
                    conversationId: data.idConversation
                })

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