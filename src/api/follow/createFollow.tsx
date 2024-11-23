'use client'

import { useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"

const useCreateFollow = ()=> {
    const [loading, setLoading] = useState(false)
    const token = useAppSelector(state => state.auth.token)

    const createFollow = async (userId: string, type: string)=> {
        setLoading(true)
        try {
            if(type === 'create'){
                const response = await axs.post(`/follow/create-follow`,{
                    followingId: userId
                } ,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log(response)
            }
            if(type === 'remove'){
                const response = await axs.delete(`/follow/remove-follow`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        followingId: userId
                    }
                })
                console.log(response)
            }
            
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    return {loading, createFollow}
}

export default useCreateFollow
