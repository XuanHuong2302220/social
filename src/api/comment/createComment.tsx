'use client'

import { addComment, addReplyComment, increaCountComment} from "@/redux/features/comment/commentSlice"
import { setCountComment } from "@/redux/features/post/postSlice"
import { selectUser } from "@/redux/features/user/userSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"

const useCreateComment = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const token = useAppSelector(state => state.auth.token)
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser)

    const createComment = async (postId: number, content: string, parentId?: string, commentId?: string) => {
        setLoading(true)
        try {
            const response = await axs.post('/comment/create-comment', {
                postId,
                content,
                parentId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = response.data
            if(parentId && commentId){
                dispatch(addReplyComment({parentId, commentId, replyComment: data}))
                dispatch(increaCountComment({parentId}))
                dispatch(setCountComment({postId}))
            }
            else {
                dispatch(addComment({
                    ...data,
                    created_by: {
                        id: user.id,
                        fullName: `${user.lastName} ${user.firstName}`,
                        avatar: user.avatar
                    },
                    created_at: new Date().toISOString()
                }))
                dispatch(setCountComment({postId}))
            }
            
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }
    return {createComment, loading}
}

export default useCreateComment