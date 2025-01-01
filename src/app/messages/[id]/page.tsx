'use client'

import useGetAllConversation from '@/api/messages/getAllConversation'
import useGetAllMessage from '@/api/messages/getAllMessage'
import useGetConversation from '@/api/messages/getConversation'
import { Conversations, UserChat } from '@/components'
import Layout from '@/components/DefaultLayout'
import useSocket from '@/socket/socket'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const MessagePage = () => {

  const {getAllConversation} = useGetAllConversation()
  const { conversation, getConversation} = useGetConversation()
  const {loading, getAllMessage} = useGetAllMessage()
  const {id}  = useParams() as { id: string }
  const [selectedConversation, setSelectedConversation] = useState(id)
  const userSocket = useSocket('users')

  useEffect(()=> {
    getAllConversation()
    getConversation(selectedConversation, true)
    getAllMessage(selectedConversation)
  }, [selectedConversation])

  const handleSelectConversation = async(conversationId: string) => {
    window.history.pushState({}, '', `/messages/${conversationId}`);
    setSelectedConversation(conversationId)
  }

  useEffect(()=> {
    if(userSocket){
      userSocket.on('conversationUpdate', conversation => {
        console.log(conversation)
      })

      return () => {
        userSocket.off('conversationUpdate')
      }
    }
  }, [userSocket])

  return (
    <Layout socket={userSocket}>
      <div className='pt-[65px] h-screen flex rounded-md bg-background'>
        <UserChat handleSelectCon={handleSelectConversation} selectedConversation={selectedConversation} className='bg-navbar w-1/3 h-full' />
        <div className='divider divider-horizontal m-0 bg-background w-[1px]' />
          {conversation && <Conversations background='search' conversation={conversation} userSocket={userSocket} loadingMess={loading} />}
        </div> 
    </Layout>
  )
}

export default MessagePage