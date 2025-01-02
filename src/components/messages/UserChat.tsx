import React, { useEffect } from 'react'
import Avatar from '../Avatar'
import { useAppSelector } from '@/redux/hooks'
import useGetConversation from '@/api/messages/getConversation'
import { selectUser } from '@/redux/features/user/userSlice'
import SkeletonReaction from '../SkeletonReaction'
import { Socket } from 'socket.io-client'
interface UserChatProps {
  className?: string,
  isBox?: boolean,
  handleSelectCon?: (conversationId: string) => void
  selectedConversation?: string,
  backgroundColor?: string,
  setShowDropdown?: (value: boolean)=> void,
  loading?: boolean,
  socket?: Socket
}

const UserChat = ({className, isBox, selectedConversation, handleSelectCon, backgroundColor, setShowDropdown, loading, socket}: UserChatProps) => {

  const conversations = useAppSelector(state => state.message.conversations)
  const user = useAppSelector(selectUser)
  const {getConversation} = useGetConversation()

  const handleCreateConversation = async(conversationId: string) => {
    if(isBox){
      getConversation(conversationId)
      setShowDropdown && setShowDropdown(false)
    }
    else {
      if(handleSelectCon) handleSelectCon(conversationId)
    }
  }

  useEffect(()=> {
    if(socket && selectedConversation){
      socket.on('conversationUpdate', conversation => {
        console.log(conversation)
      })
    }
      return ()=> {socket?.off('conversationUpdate');}
  }, [socket, selectedConversation])

  return (
    <div className={`${className} flex flex-col z-50`}>
        <span className={`text-textColor py-3 text-2xl ${backgroundColor ? backgroundColor : 'bg-primaryColor'} font-bold px-4`}>Messages</span>
        <div className='divider m-0 bg-background h-[1px]' />
        <div className='flex flex-col gap-2 mt-3 px-4'>
          {conversations.length > 0 && !loading ? conversations.map((conversation) => (
            <div key={conversation.id} className={`flex items-center ${!isBox && selectedConversation === conversation.id ? 'bg-search' : ''} gap-2 p-2 rounded-lg cursor-pointer hover:bg-search`} onClick={()=>handleCreateConversation(conversation.id)}>
              <Avatar id={conversation?.sender.id === user.id ? conversation?.receiver.id : conversation?.sender.id} width={1} height={1} src={conversation.sender.id === user.id ? conversation.receiver.avatar ?? undefined : conversation.sender.avatar ?? undefined} alt='search' className='w-12 h-12' />
              <div className='flex flex-col'>
                  <span className='text-textColor text-lg font-bold'>{conversation.sender.id === user.id ? conversation.receiver.fullName : conversation.sender.fullName}</span>
                  {conversation.lastMessage && <span className='text-sm text-textColor'>{conversation.lastMessage.content}</span>}
              </div>
            </div>
          )) : loading ? <SkeletonReaction /> : <span className='text-textColor text-center'>No messages</span>}

        </div>
    </div>
  )
}

export default UserChat