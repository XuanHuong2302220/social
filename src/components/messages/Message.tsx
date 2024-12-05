import React from 'react'
import Avatar from '../Avatar'
import { Message as IMessage } from '@/types'
import { useAppSelector } from '@/redux/hooks'
import { selectUser } from '@/redux/features/user/userSlice'

interface MessageProps {
  message: IMessage
}

const Message = ({message}: MessageProps) => {

  const user = useAppSelector(selectUser)
  return (
    <div className={`chat ${message.sender.id === user.id ? 'chat-end' : 'chat-start'}`} >
       {message.sender.id !== user.id && <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <Avatar src={message.sender.avatar ?? undefined} id={message.sender.id} alt='message' width={1} height={1} className='w-10 h-10' />
          </div>
        </div>}
        <div className="chat-bubble bg-navbar text-textColor">{message.content}</div>
        <div className="chat-footer opacity-50">{message.created_ago}</div>
    </div>
  )
}

export default Message