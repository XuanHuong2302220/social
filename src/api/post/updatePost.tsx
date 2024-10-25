'use client'

import { editPost } from "@/redux/features/post/postSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"

interface updatePost {
    postId: number,
    description?: string,
    images?: string[]
}

const updatePost = () =>{

    const token = useAppSelector(state => state.auth.token)
    const [loading, setLoading] = useState(false)

    const dispatch = useAppDispatch()

    const update = async (data: updatePost) => {
       try {
        setLoading(true)
        const response = await axs.post(`post/update-post/${data.postId}`, {
            description: data.description,
            images: data.images
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const post = await response.data.post
        dispatch(editPost(post))
       
       } catch (error) {
              console.log(error)
       }
       finally {
            setLoading(false)
       }
    }
    return {loading, update}
}

export default updatePost