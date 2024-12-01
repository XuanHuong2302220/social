'use client'

import useGetAllConversation from '@/api/messages/getAllConversation'
import useGetAllMessage from '@/api/messages/getAllMessage'
import useGetConversation from '@/api/messages/getConversation'
import { Conversations, UserChat } from '@/components'
import Layout from '@/components/DefaultLayout'
import { useAppSelector } from '@/redux/hooks'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {

  const {getAllConversation} = useGetAllConversation()
  const { conversation, getConversation} = useGetConversation()
  const {loading, getAllMessage} = useGetAllMessage()
  const {id}  = useParams() as { id: string }
  const [selectedConversation, setSelectedConversation] = useState(id)

  useEffect(()=> {
    getAllConversation()
    getConversation(selectedConversation)
    getAllMessage(selectedConversation)
  }, [selectedConversation])

  const handleSelectConversation = async(conversationId: string) => {
    window.history.pushState({}, '', `/messages/${conversationId}`);
    setSelectedConversation(conversationId)
  }

  return (
    <Layout>
        <div className='pt-[65px] h-screen flex rounded-md bg-background'>
          <UserChat handleSelectCon={handleSelectConversation} selectedConversation={selectedConversation} className='bg-navbar w-1/3 h-full' />
          <div className='divider divider-horizontal m-0 bg-background w-[1px]' />
            <Conversations background='search' conversation={conversation} loadingMess={loading} />
        </div> 
    </Layout>
  )
}

export default page