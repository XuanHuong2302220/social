'use client'

import { useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useState } from "react"
import { Socket } from "socket.io-client"

const useCreateFollow = (socket?: Socket)=> {
    const [loading, setLoading] = useState(false)
    const token = useAppSelector(state => state.auth.token)
    const [isFollow, setIsFollow] = useState('')

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

                const data = await response.data
                if(data.notify){
                    socket?.emit('sendNotification', {
                        id1: data.notify.id
                    })
                }
                setIsFollow(data.isFollowing)
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
                const data = await response.data
                setIsFollow(data.isFollowing)
            }
            
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    return {loading, createFollow, isFollow}
}

export default useCreateFollow
