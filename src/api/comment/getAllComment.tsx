'use client'

import { addComments, addReplyComments } from "@/redux/features/comment/commentSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"
import { Comment } from "@/types"


const useGetAllComment = ()=> {
    const [loading, setLoading] = useState<boolean>(false)
    const token = useAppSelector(state => state.auth.token)
    const dispatch = useAppDispatch()
    const [replyComments, setReplyComments] = useState<Comment[]>([])

    const getAllComment = async (postId: number, commentId?: string) => {
        setLoading(true)
        try {
            const response = await axs.get(`/comment/get-comment-of-post/${postId}?page=1&pageSize=10${commentId ? `&commentId=${commentId}`: ''}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const {data} = response.data
            if(commentId){
                console.log(data)
                // setReplyComments(data)
                dispatch(addReplyComments({commentId: commentId, replyComments: data}))
            }
            else {
                dispatch(addComments(data))
            }
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }
    return {getAllComment, replyComments, setReplyComments, loading}
}

export default useGetAllComment