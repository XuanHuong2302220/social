'use client'

import { Conversations, UserChat } from '@/components'
import Layout from '@/components/DefaultLayout'
import React from 'react'

const page = () => {
  return (
    <Layout>
        <div className='pt-[65px] h-screen flex rounded-md bg-background'>
            <UserChat className='bg-navbar w-1/3 h-full' />
            <div className='divider divider-horizontal m-0 bg-background w-[1px]' />
            <Conversations />
        </div>
    </Layout>
  )
}

export default page