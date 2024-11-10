'use client'

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"
import { deleteComment as DeleteNewCommnet } from "@/redux/features/comment/commentSlice"

const useDeleteComment = () => {
    const [loading, setLoading] = useState(false)
    const token = useAppSelector(state => state.auth.token)
    const dispatch = useAppDispatch()

    const deleteComment = async (id: string) => {
        setLoading(true)
        try {
            const response = await axs.delete(`/comment/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            await response.data
            dispatch(DeleteNewCommnet(id))
            
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    return {deleteComment, loading}
}

export default useDeleteComment