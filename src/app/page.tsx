'use client'

import React from 'react'
import withAuth from '@/middleware/withAuth'
import { NewPost } from '@/components'
import { useAppSelector } from '@/redux/hooks'

const Home = () => {
  
  return (
    <div className='h-screen p-[90px] w-full flex justify-between '>
      <div className='w-1/4 bg-navbar'>profile</div>
      <div className='flex-1 px-5'>
          <NewPost />
      </div>
      <div className='w-1/4 bg-navbar'>friends</div>

    </div>
  )
}

export default withAuth(Home)