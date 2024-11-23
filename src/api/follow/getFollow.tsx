'use client'

import { useAppSelector } from "@/redux/hooks"
import { UserState } from "@/types"
import axs from "@/utils/axios"
import { useState } from "react"

interface UserFollow {
    id: string,
    fullName: string,
    avatar: string | null,
    userName: string,
    isFollowing: string
}

const useGetFollow = ()=> {

    const [loading, setLoading] = useState(false)
    const token = useAppSelector(state => state.auth.token)
    const [follows, setFollow] = useState<UserFollow[]>([])

    const getFollow = async (type: string, userId: string) => {
        setLoading(true)
        setFollow([])
        try {
            const response = await axs.get(`/follow/get-${type}-of-user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setFollow(response.data.data)
            console.log(response.data.data);
        } catch (error) {
            console.log(error);
        }
        finally{
            setLoading(false)
        }
    }

    return {loading, getFollow, follows}
}

export default useGetFollow