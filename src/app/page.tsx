'use client'

import React, { useState } from 'react'
import withAuth from '@/middleware/withAuth'
import { ModalPost, NewPost } from '@/components'

const Home = () => {

  return (
    <div className='h-screen p-[90px] w-screen flex justify-between '>
      <div className='w-1/4 bg-navbar'>profile</div>
      <div className='flex-1 px-5'>
          <NewPost />
      </div>
      <div className='w-1/4 bg-navbar'>friends</div>
      
      <ModalPost />
    </div>
  )
}

export default withAuth(Home)