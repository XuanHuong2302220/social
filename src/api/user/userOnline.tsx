'use client'

import { selectUser } from "@/redux/features/user/userSlice"
import { useAppSelector } from "@/redux/hooks"
import useSocket from "@/socket/socket"
import { UserState } from "@/types"
import { useEffect, useState } from "react"

const useUserOnline = () => {
    
    const [userOnline, setUserOnline] = useState<UserState[]>()
    const user = useAppSelector(selectUser)
    const socket = useSocket(`users/${user.id}`)

    useEffect(()=> {
        if(socket){
            socket.on('onlineUsers', (users: UserState[])=> {
                console.log(users, 'users')
                setUserOnline(users)
            })

            return ()=> {
                socket.off('onlineUsers')
            }
        }
    }, [socket])

    const getUserOnline = ()=> {
        try {
            if(socket){
                socket.emit('getOnlineUsers')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return {userOnline, getUserOnline}

}

export default useUserOnline