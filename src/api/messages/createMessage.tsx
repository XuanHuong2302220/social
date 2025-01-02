'use client'

import {addMessage } from "@/redux/features/messages/messageSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import useSocket from "@/socket/socket"
import { useEffect, useState } from "react"
// import soundMessage from '@/assets/sound/notification.wav'
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
    const sound = new Audio('https://firebasestorage.googleapis.com/v0/b/talktown-a55fe.appspot.com/o/sound%2Fnotification.wav?alt=media&token=b47082f5-825e-464e-af26-401515d26532')

    useEffect(()=> {
        if(socket){
            socket.emit('joinConversation', { conversationId: idConversation });
            socket.on('messageCreated', (message)=> {
                if(message.receiver.id === user.id) {
                    sound.play()
                }
                if(userSocket && message.sender.id === user.id){
                    userSocket.emit('getConversation', {conversationId: message.idConversation, senderId: message.sender.id})
                }
                dispatch(addMessage({id: message.idConversation, message}))
            })
        }

        return ()=> {socket?.off('messageCreated')}

    }, [socket, dispatch, idConversation])

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