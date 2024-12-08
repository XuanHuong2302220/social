'use client'

import { addComments, addReplyComments, setCurrentPage, setHasMore } from "@/redux/features/comment/commentSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"
import { Comment } from "@/types"


const useGetAllComment = ()=> {
    const [loading, setLoading] = useState<boolean>(false)
    const token = useAppSelector(state => state.auth.token)
    const hasNextPage = useAppSelector(state => state.comment.hasMore)
    const currentPage = useAppSelector(state => state.comment.currentPage)
    const dispatch = useAppDispatch()

    const getAllComment = async (postId: number, commentId?: string) => {
        setLoading(true)
        try {
            const response = await axs.get(`/comment/get-comment-of-post/${postId}?page=${!commentId ? currentPage : 1}&pageSize=10${commentId ? `&commentId=${commentId}`: ''}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const {data, meta} = response.data
            if(commentId){
                console.log(data)
                dispatch(addReplyComments({commentId: commentId, replyComments: data}))
            }
            else {
                console.log(response.data)
                dispatch(addComments(data))
                if(meta.hasNextPage){
                    dispatch(setCurrentPage(currentPage + 1))
                    dispatch(setHasMore(meta.hasNextPage))
                }
                else{
                    dispatch(setHasMore(false))
                }
            }
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }
    return {getAllComment, loading}
}

export default useGetAllComment