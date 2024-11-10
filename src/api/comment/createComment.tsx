'use client'

import { addComment} from "@/redux/features/comment/commentSlice"
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

    const createComment = async (postId: number, content: string) => {
        setLoading(true)
        try {
            const response = await axs.post('/comment/create-comment', {
                postId,
                content
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = response.data
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