'use client'

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"
import { deletePost as deletePostAction } from "@/redux/features/post/postSlice"

const useDeletePost = () => {
    const [loading, setLoading] = useState(false)
    const token = useAppSelector(state => state.auth.token)
    const dispatch = useAppDispatch();

    const deletePost = async (postId: number) => {
        setLoading(true)
        try {
           await axs.delete(`/post/delete-post/${postId}`, {
                headers: {
                     Authorization: `Bearer ${token}`
                }
           })

          if(postId){
            dispatch(deletePostAction({postId}))
          }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return {loading, deletePost}
}

export default useDeletePost