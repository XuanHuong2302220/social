'use client'

import { useAppSelector } from '@/redux/hooks'
import React from 'react'
import Avatar from '../Avatar'
import { reactions } from '@/utils/reactions'
import commentIcon from '@/assets/icons/comment.svg'
import followIcon from '@/assets/icons/follow.svg'
import { Notification } from '@/types'
import SkeletonReaction from '../SkeletonReaction'

interface NotiBoxProps {
   handleOpenPostNotify: (postId: number, comment: string, parentId?: string) => void,
   loading: boolean
}

const NotiBox = ({handleOpenPostNotify, loading}: NotiBoxProps) => {

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
        },
        {
            color: 'text-purple-500',
            name: 'follow',
            icon: followIcon
        }
    ]

    const handleGetType = (notify: string, reactionType?: string) => {
        if(notify === 'comment' || notify === 'reply comment' ){ 
            return reactionTypes.find(react => react.name === notify)?.icon.src
        }

        else if (notify === 'react post'|| notify === 'react comment'){
            return reactionTypes.find(react => react.name === reactionType)?.icon.src
        }
        else if (notify === 'follow'){
            return reactionTypes.find(react => react.name === notify)?.icon.src
        }
    }

    const handleSelectNotify = (notify: Notification) =>{ 
        if(notify.type === 'follow'){
            window.location.href = `/${notify.sender.username}`
        }
        else {
            handleOpenPostNotify(notify.post, notify.comment ?? '', notify.parent?.id)
        }
    }

    
    const handleNotiContent = (noti: Notification) => {
        const hightLights = [noti.sender.fullName];
        const regex = new RegExp(`(${hightLights.join('|')}|#\\w+)`, 'gi');

        let content = ''

        if(noti.comment_content){
            content = noti.content + ": " + noti.comment_content
        }

        else {
            content = noti.content
        }
    
        return content?.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line.split(regex).map((part, i) => {
                    const isHighlight = hightLights.some(highlight => part.includes(highlight)) || /#\w+/.test(part);
                    return isHighlight ? (
                        <span key={i} className="text-blue-500 font-bold">{part}</span>
                    ) : (
                        part
                    );
                })}
                <br />
            </React.Fragment>
        ));
    };
    
    return (
        <div className='flex flex-col z-50'>
            <span className='text-textColor py-3 font-bold text-2xl px-4'>Notify</span>
            <div className='divider m-0 bg-background h-[1px]' />
            <div className='flex flex-col max-h-[90%] overflow-y-auto gap-2 mt-3 px-4'>
               {notifications.length > 0 ? notifications.map((noti)=> (
                <div key={noti.id} className='flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-search' onClick={()=>handleSelectNotify(noti)}>
                    <Avatar width={1} height={1} src={noti.sender.avatar ?? undefined} alt={noti.sender.avatar ?? ''} className='w-12 h-12' />
                    <div className='flex justify-between w-full gap-1'>
                        <span className='text-md text-textColor'>
                        {handleNotiContent(noti)}
                        </span>
                        <img src={handleGetType(noti.type, noti.reaction_type)} alt='icon' className='w-8 h-8' />
                    </div>
                    
                 </div>
               )) : loading ? <SkeletonReaction /> : notifications.length === 0 && <span className='text-textColor text-lg text-center p-5'>No notification</span>}
            </div>
        </div>
    )
}

export default NotiBox