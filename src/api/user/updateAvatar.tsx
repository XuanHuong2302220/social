'use client'

import { selectUser, setAttributes } from "@/redux/features/user/userSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"


const useUpdateAvatar = () => {

    const [loading, setLoading] = useState(false)
    const token = useAppSelector(state => state.auth.token)
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser)
    
    const updateAvatar = async (file: string) => {
        setLoading(true)
        try {
            const response = await axs.post('/user/update-avatar', { avatar: file }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response){
                dispatch(setAttributes({
                    ...user,
                    avatar: file
                }))
            }
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }
    return { updateAvatar, loading }
}

export default useUpdateAvatar