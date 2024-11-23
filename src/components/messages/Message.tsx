import React from 'react'
import Avatar from '../Avatar'

interface MessageProps {
    direction: 'chat-start' | 'chat-end'
}

const Message = ({direction}: MessageProps) => {
  return (
    // <div className={`chat chat-${direction}`}>
    //     <div className="chat-image avatar">
    //         <Avatar src='' alt='message' width={1} height={1} className='w-10 h-10'  />
    //     </div>
    //     <div className="chat-bubble bg-search">I hate you!</div>
    //     <time className="text-xs opacity-50">12:45</time>
    // </div>
    <div className={`chat ${direction}`} >
        <div className="chat-image avatar">
            <div className="w-10 rounded-full">
                <Avatar src='' alt='message' width={1} height={1} className='w-10 h-10'  />
            </div>
        </div>
        <div className="chat-header text-textColor">
            Ngo Xuan Huong
        </div>
        <div className="chat-bubble bg-search text-textColor">You were the Chosen One!</div>
        <div className="chat-footer opacity-50">12:45</div>
    </div>
  )
}

export default Message