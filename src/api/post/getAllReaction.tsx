'use client'

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { InteractProps, Reaction } from "@/types"
import axs from "@/utils/axios"
import { useState } from "react"
import { reactions } from "@/utils/reactions"

interface ReactionRespone{
  type: string;
  count: number
}

const useGetReactions = ()=> {

    const [loading, setLoading] = useState(false)
    const token = useAppSelector(state => state.auth.token)
    const [typeReaction, setTypeReaction] = useState<ReactionRespone[]>([])
    const [listReaction, setListReaction] = useState<Reaction[]>([])

    const getAllReactions = async (postId: number, type?: string) => {
        setLoading(true)
        try {
            const response = await axs.get(`/reaction/get-reaction-of-post/${postId}?page=1&pageSize=10${type ? `&reactionTypes=${type}` : ''}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const {reactions, typeUserReacted} = await response.data
            if(!type){
                setTypeReaction(typeUserReacted)
                setListReaction(reactions)
                console.log(reactions)
            }
            else {
                setListReaction(reactions)
            }
           
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }

    return {loading, getAllReactions, typeReaction, listReaction}
}

export default useGetReactions