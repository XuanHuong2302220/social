'use client'

import { addPost } from "@/redux/features/post/postSlice"
import { selectUser, setAttributes } from "@/redux/features/user/userSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"
import { toast } from "react-toastify"

interface CreatePostRequest {
    description?: string,
    images?: string[]
}

const useCreatePost = () => {
    const [loading, setLoading] = useState(false)
    const token = useAppSelector(state => state.auth.token)
    const user = useAppSelector(selectUser)
    const dispatch = useAppDispatch();

    const createPost = async (data: CreatePostRequest) => {
        setLoading(true)
        try {
            const response = await axs.post('/post/create-post', {
                description: data.description,
                images: data.images
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const post = await response.data

            dispatch(setAttributes({
                ...user,
                postCount: user.postCount && user.postCount + 1
            }))

            dispatch(addPost({
                ...post,
                created_ago: 'Just now'
            }))

        } catch (error: any) {
            toast.error(error)
        }
        finally{
            setLoading(false)
        }
    }
    return {loading, createPost}
}

export default useCreatePost