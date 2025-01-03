'use client'

import NotFound from "@/app/not-found"
import { addMessages } from "@/redux/features/messages/messageSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"

const useGetAllMessage = () => {
    const [loading, setLoading] = useState(false)
    const token = useAppSelector(state => state.auth.token)
    const dispatch = useAppDispatch()

    const getAllMessage = async (conversationId: string) => {

        setLoading(true)
        try {
            const response = await axs.get(`/message/get-messages/${conversationId}?page=1&pageSize=50`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const {data} = await response.data
            // console.log(data)
            dispatch(addMessages({id: conversationId, messages: data}))

        } catch (error) {
            return <NotFound />
        }
        finally {
            setLoading(false)
        }
    }
    return { getAllMessage, loading }
}

export default useGetAllMessage