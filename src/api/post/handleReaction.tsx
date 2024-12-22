'use client'

import { useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { Socket } from "socket.io-client"

const useHandleReaction = (socket?: Socket) => {

    const token = useAppSelector(state => state.auth?.token)
    
    const createReaction = async (postId: number, reaction: string) => {
        try {
           const response = await axs.post('/reaction/create-reaction-of-post', {
                reactionType: reaction,
                postId: postId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = response.data
            
            if(data.notify){
                socket?.emit('sendNotification', {
                    id1: data.notify.id
                })
            }

        } catch (error) {
            console.log(error)
        }
    }

    const createReactionComment = async (commentId: string, reaction: string) => {
        try {
         const response = await axs.post('/reaction/create-reaction-of-comment', {
                reactionType: reaction,
                commentId: commentId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = response.data

            if(data.notify){
                socket?.emit('sendNotification', {
                    id1: data.notify.id
                })
            }

        } catch (error) {
            console.log(error)
        }
    }

    const undoReaction = async (postId: number) => {
        try {
            await axs.delete(`/reaction/undo-reaction-of-post/${postId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

        } catch (error) {
            console.log(error)
        }
    }

    const undoReactionComment = async (commentId: string) => {
        try {
            await axs.delete(`/reaction/undo-reaction-of-comment/${commentId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

        } catch (error) {
            console.log(error)
        }
    }
    

    return { createReaction, undoReaction, createReactionComment, undoReactionComment }
}

export default useHandleReaction