'use client'

import { useAppSelector } from '@/redux/hooks'
import React, { useState } from 'react'
import Avatar from '../Avatar'
import { reactions } from '@/utils/reactions'
import commentIcon from '@/assets/icons/comment.svg'
import axs from '@/utils/axios'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import ModalPostComment from '../post/ModalPostComment'
import { PostState } from '@/types'

interface NotiBoxProps {
    closeBox: () => void
}

const NotiBox = ({closeBox}: NotiBoxProps) => {

    const notifications = useAppSelector((state) => state.notification.notifications)
    const token = useAppSelector((state) => state.auth.token)
    const [postNoti, setPostNoti] = useState<PostState | null>(null)
    const reactionTypes = [
        ...reactions,
        {
            color: 'text-purple-500',
            name: 'comment',
            icon: commentIcon
        }
    ]

    const handleOpenNoti = async(postId: number)=> {
        try {
            const response = await axs.get(`/post/get-post/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await response.data
            setPostNoti(data)
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
        finally{
            // closeBox()
        }
    }

    return (
        <div className='flex flex-col z-50'>
            <span className='text-textColor py-3 font-bold text-2xl px-4'>Notify</span>
            <div className='divider m-0 bg-background h-[1px]' />
            <div className='flex flex-col gap-2 mt-3 px-4'>
               {notifications.map((noti)=> (
                <div key={noti.id} className='flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-search' onClick={()=>handleOpenNoti(noti.post)}>
                    <Avatar width={1} height={1} src={noti.sender.avatar ?? undefined} alt={noti.sender.avatar ?? ''} className='w-12 h-12' />
                    <div className='flex'>
                        <span className='text-md text-textColor'>{noti.content}</span>
                        <img src={reactionTypes.find(react => react.name === noti.type)?.icon.src} alt='icon' className='w-8 h-8' />
                    </div>
                 </div>
               ))}
            </div>

            {postNoti && <ModalPostComment
                post={postNoti}
                closeFunc={()=>setPostNoti(null)}
            />}
        </div>
    )
}

export default NotiBox