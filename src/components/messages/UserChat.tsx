import React from 'react'
import Avatar from '../Avatar'
interface UserChatProps {
    className?: string
}

const UserChat = ({className}: UserChatProps) => {
  return (
    <div className={`${className} flex flex-col`}>
        <span className='text-textColor py-4 text-2xl font-bold px-4'>Messages</span>
        <div className='divider m-0 bg-background h-[1px]' />
        <div className='flex flex-col gap-2 mt-3 px-4'>
          <div className='flex items-center gap-2 p-2 bg-search rounded-lg'>
            <Avatar width={1} height={1} src='' alt='search' className='w-12 h-12' />
            <div className='flex flex-col'>
                <span className='text-textColor text-lg font-bold'>User Search</span>
                <span className='text-sm text-textColor'>Following</span>
            </div>
          </div>

          <div className='flex items-center gap-2 p-2 rounded-lg'>
            <Avatar width={1} height={1} src='' alt='search' className='w-12 h-12' />
            <div className='flex flex-col'>
                <span className='text-textColor text-lg font-bold'>User Search</span>
                <span className='text-sm text-textColor'>Following</span>
            </div>
          </div>

          <div className='flex items-center gap-2 p-2 rounded-lg'>
            <Avatar width={1} height={1} src='' alt='search' className='w-12 h-12' />
            <div className='flex flex-col'>
                <span className='text-textColor text-lg font-bold'>User Search</span>
                <span className='text-sm text-textColor'>Following</span>
            </div>
          </div>
          
        </div>
    </div>
  )
}

export default UserChat