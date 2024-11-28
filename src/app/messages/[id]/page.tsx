'use client'

import useGetAllConversation from '@/api/messages/getAllConversation'
import useGetAllMessage from '@/api/messages/getAllMessage'
import { Conversations, UserChat } from '@/components'
import Layout from '@/components/DefaultLayout'
import { useAppSelector } from '@/redux/hooks'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {

  const {getAllConversation} = useGetAllConversation()
  const {loading: loadingMessage, getAllMessage} = useGetAllMessage()

  const { id } = useParams<{ id: string }>()

  const conversation = useAppSelector(state => state.message.conversations.find(con => con.id === id))
  console.log(conversation)

  useEffect(()=> {
    getAllConversation()
  }, [])

  return (
    <Layout>
        <div className='pt-[65px] h-screen flex rounded-md bg-background'>
          <UserChat className='bg-navbar w-1/3 h-full' />
          <div className='divider divider-horizontal m-0 bg-background w-[1px]' />
            {/* <Conversations background='search' conversation={conversation} /> */}
        </div>
    </Layout>
  )
}

export default page