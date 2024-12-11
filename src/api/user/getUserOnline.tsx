'use client'

import { setUserOnline } from "@/redux/features/socket/socketSlice"
import { useAppDispatch } from "@/redux/hooks"
import useSocket from "@/socket/socket"
import { useEffect } from "react"

const useGetOnlineUser = ()=> {

    const socket = useSocket('users')
    const dispatch = useAppDispatch()

    useEffect(()=> {
        if(socket){
          socket.emit('getOnlineUsers')
          socket.on('onlineUsers', users => {
            dispatch(setUserOnline(users))
         })

          return () => {
            socket.off('onlineUsers')
          }
        }
    }, [socket])

    const getOnlineUser = async()=>{
        try{
           if(socket){
             socket.emit('getOnlineUsers')
           }
        }catch(err){
            console.log(err)
        }
    }

    return {getOnlineUser}
}

export default useGetOnlineUser