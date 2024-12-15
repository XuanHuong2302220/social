'use client'

import { useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { AxiosError } from "axios"
import { useState } from "react"
import { toast } from "react-toastify"

const useGetAllNoti = ()=> {

    const [loading, setLoading] = useState<boolean>(false)
    const token = useAppSelector((state)=> state.auth.token)

    const getAllNotify = async ()=> {
        setLoading(true)

        try {
            const response = await axs.get('/notification/get-all-notifications', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(response.data)
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
        finally{
            setLoading(false)
        }
    }
    return {getAllNotify, loading}
}

export default useGetAllNoti