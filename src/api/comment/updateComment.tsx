'use client'

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"
import { updateComment as newUpdateComment, updateReplyComment } from "@/redux/features/comment/commentSlice"

const useUpdateComment = () => {

    const [loading, setLoading] = useState(false)
    const token = useAppSelector(state => state.auth.token)
    const dispatch = useAppDispatch()

    const updateComment = async (id: string, text: string, parentId?: string) => {
        setLoading(true)
        try {
            const response = await axs.put(`/comment/update-comment/${id}`, {
                content: text
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.data
            if(parentId) {
                dispatch(updateReplyComment({commentId: id, parentId: parentId, replyComment: data}))
            }
            else {
                dispatch(newUpdateComment(data))
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    return {updateComment, loading}
} 

export default useUpdateComment