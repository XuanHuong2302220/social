'use client'

import useGetAllConversation from '@/api/messages/getAllConversation'
import useGetConversation from '@/api/messages/getConversation'
import { Conversations, UserChat } from '@/components'
import Layout from '@/components/DefaultLayout'
import useSocket from '@/socket/socket'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const MessagePage = () => {

  const { conversation, getConversation} = useGetConversation()
  const {getAllConversation} = useGetAllConversation()
  const userSocket = useSocket('users')
  const {id}  = useParams() as { id: string }
  const [selectedConversation, setSelectedConversation] = useState(id)

  useEffect(()=> {
    getAllConversation()
  }, [])

  useEffect(()=> {
    getConversation(selectedConversation)
  }, [selectedConversation])

  const handleSelectConversation = async(conversationId: string) => {
    window.history.pushState({}, '', `/messages/${conversationId}`);
    setSelectedConversation(conversationId)
  }

  return (
    <Layout socket={userSocket}>
      <div className='pt-[65px] h-screen flex rounded-md bg-background'>
        <UserChat handleSelectCon={handleSelectConversation} selectedConversation={selectedConversation} className='bg-navbar w-1/3 h-full' socket={userSocket} />
        <div className='divider divider-horizontal m-0 bg-background w-[1px]' />
          {conversation && <Conversations background='search' conversation={conversation} userSocket={userSocket}/>}
        </div> 
    </Layout>
  )
}

export default MessagePage