import React from 'react'
import Avatar from '../Avatar'
import { useAppSelector } from '@/redux/hooks'
import useGetConversation from '@/api/messages/getConversation'
interface UserChatProps {
  className?: string,
  isBox?: boolean
}

const UserChat = ({className, isBox}: UserChatProps) => {

  const conversations = useAppSelector(state => state.message.conversations)
  const {getConversation} = useGetConversation()

  const handleCreateConversation = async(conversationId: string) => {
    if(isBox){
      getConversation(conversationId)
    }
  }

  return (
    <div className={`${className} flex flex-col z-50`}>
        <span className='text-textColor py-4 text-2xl font-bold px-4'>Messages</span>
        <div className='divider m-0 bg-background h-[1px]' />
        <div className='flex flex-col gap-2 mt-3 px-4'>
          {conversations.length > 0 ? conversations.map((conversation, index) => (
            <div key={conversation.id} className='flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-search' onClick={()=>handleCreateConversation(conversation.id)}>
              <Avatar width={1} height={1} src={conversation.receiver.avatar ?? undefined} alt='search' className='w-12 h-12' />
              <div className='flex flex-col'>
                  <span className='text-textColor text-lg font-bold'>{conversation.receiver.fullName}</span>
                  {conversation.lastMessage && <span className='text-sm text-textColor'>{conversation.lastMessage.content}</span>}
              </div>
            </div>
          )) : <span className='text-textColor text-center'>No messages</span>}

        </div>
    </div>
  )
}

export default UserChat