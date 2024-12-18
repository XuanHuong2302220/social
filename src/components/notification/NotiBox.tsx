'use client'

import { useAppSelector } from '@/redux/hooks'
import React from 'react'
import Avatar from '../Avatar'
import { reactions } from '@/utils/reactions'
import commentIcon from '@/assets/icons/comment.svg'
import { Notification } from '@/types'

interface NotiBoxProps {
   handleOpenPostNotify: (postId: number, comment: string, parentId?: string) => void
}

const NotiBox = ({handleOpenPostNotify}: NotiBoxProps) => {

    const notifications = useAppSelector((state) => state.notification.notifications)

    const reactionTypes = [
        ...reactions,
        {
            color: 'text-purple-500',
            name: 'comment',
            icon: commentIcon
        },
        {
            color: 'text-purple-500',
            name: 'reply comment',
            icon: commentIcon
        }
    ]

    const handleSelectNotify = (notify: Notification) =>{ 
        handleOpenPostNotify(notify.post, notify.comment ?? '', notify.parentId)
    }

    return (
        <div className='flex flex-col z-50'>
            <span className='text-textColor py-3 font-bold text-2xl px-4'>Notify</span>
            <div className='divider m-0 bg-background h-[1px]' />
            <div className='flex flex-col gap-2 mt-3 px-4'>
               {notifications.map((noti)=> (
                <div key={noti.id} className='flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-search' onClick={()=>handleSelectNotify(noti)}>
                    <Avatar width={1} height={1} src={noti.sender.avatar ?? undefined} alt={noti.sender.avatar ?? ''} className='w-12 h-12' />
                    <div className='flex'>
                        <span className='text-md text-textColor'>{noti.content + ": " + noti.comment_content}</span>
                        <img src={reactionTypes.find(react => react.name === noti.type)?.icon.src} alt='icon' className='w-8 h-8' />
                    </div>
                    
                 </div>
               ))}
            </div>
        </div>
    )
}

export default NotiBox