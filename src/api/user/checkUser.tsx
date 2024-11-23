'use client'

import { useAppSelector } from "@/redux/hooks"
import { UserState } from "@/types"
import axs from "@/utils/axios"
import { useState } from "react"


const useCheckUser = ()=> {

    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState<UserState>()
    const token = useAppSelector(state => state.auth.token)

    const checkUser = async(username: string)=> {

        setLoading(true)
        try {
            const response = await axs.get(`/user/check-username/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await response.data.user;
            console.log(data)
            if(data){
                setProfile(data)
            }
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }

    }
    return {loading, checkUser, profile}
}

export default useCheckUser