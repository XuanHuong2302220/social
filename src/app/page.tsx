'use client'

import React, { useState } from 'react'
import withAuth from '@/middleware/withAuth'
import { ModalPost, NewPost, Post } from '@/components'
import { useAppSelector } from '@/redux/hooks'
import { selectPost } from '@/redux/features/post/postSlice'
import { selectUser } from '@/redux/features/user/userSlice'

const Home = () => {

  const post = useAppSelector(selectPost)

  return (
    <div className='h-screen p-[90px] w-screen flex justify-between '>
      <div className='w-1/4 bg-navbar'>profile</div>
      <div className='flex-1 flex-col px-5'>
          <NewPost />
          <Post />
      </div>
      <div className='w-1/4 bg-navbar'>friends</div>
      
      <ModalPost />


    </div>
  )
}

export default withAuth(Home)