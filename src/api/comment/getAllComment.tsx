'use client'

import { addComments } from "@/redux/features/comment/commentSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"


const useGetAllComment = ()=> {
    const [loading, setLoading] = useState<boolean>(false)
    const token = useAppSelector(state => state.auth.token)
    const dispatch = useAppDispatch()


    const getAllComment = async (postId: number) => {
        setLoading(true)
        try {
            const response = await axs.get(`/comment/get-comment-of-post/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const {data} = response.data
            console.log(data)
            dispatch(addComments(data))
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