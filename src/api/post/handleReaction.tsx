'use client'

import { decreaseLike, increaLike } from "@/redux/features/post/postSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"

const useHandleReaction = () => {

    const token = useAppSelector(state => state.auth?.token)
    
    const createReaction = async (postId: number, reaction: string) => {
        try {
            await axs.post('/reaction/create-reaction-of-post', {
                reactionType: reaction,
                postId: postId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

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
    

    return { createReaction, undoReaction }
}

export default useHandleReaction