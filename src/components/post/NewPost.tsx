import React from 'react'
import {Avatar} from '@/components'
const NewPost = () => {
  return (
    <div className='w-full h-[150px] bg-navbar p-4' >
        <div className='h-2/3 gap-5 flex justify-between w-full'>
            <Avatar width={1} height={1} alt='avatar' />
            <div className='w-full justify-center flex h-2/3 items-center bg-search rounded-box'>What's on your mind?</div>
        </div>
        <div className='divider'></div>
        <div className='h-1/4'></div>
    </div>
  )
}

export default NewPost