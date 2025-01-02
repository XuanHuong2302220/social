'use client'

import React, {useState } from 'react'
import {Avatar, Button, ModalPost} from '@/components'
import { FaImages } from "react-icons/fa";
import { BsPaperclip } from "react-icons/bs";
import { AiTwotoneAudio } from "react-icons/ai";
import { selectUser } from '@/redux/features/user/userSlice';
import { useAppSelector } from '@/redux/hooks';

const NewPost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const user = useAppSelector(selectUser)

  const {username} = user

  return (
    <div className='w-full h-[150px] bg-navbar p-4 rounded-xl'>
        <div className='h-2/4 gap-3 flex justify-between items-center w-full'>
            <a href={`/${username}`}>
              <Avatar width={1} height={1} alt='avatar' id={user.id} src={user.avatar ? user.avatar : undefined} className='w-[52px] h-[52px]'/>
            </a>
            <div className='w-full p-4 flex h-full items-center text-textColor bg-search rounded-full cursor-pointer hover:opacity-50' onClick={()=>setIsModalOpen(true)}>What&apos;s on your mind?</div>
        </div>
        <div className='divider mx-0 my-1'></div>
        <div className='h-1/3 w-full justify-between flex items-center'>
            <Button left icon={<FaImages />} className='bg-transparent cursor-default border-transparent hover:bg-transparent hover:border-transparent' text='Image'  />
            <Button left icon={<BsPaperclip />} className='bg-transparent cursor-default border-transparent hover:bg-transparent hover:border-transparent' text='Attchmemt'  />
            <Button left icon={<AiTwotoneAudio />} className='bg-transparent cursor-default border-transparent hover:bg-transparent hover:border-transparent' text='audio'  />
            <Button onClick={()=>setIsModalOpen(true)} text='Post' className='bg-primaryColor w-[80px] h-[40pxco] rounded-full text-white hover:bg-primaryColor hover:opacity-60 hover:text-white'  />
        </div>
        {isModalOpen && <ModalPost 
          onClose={() => setIsModalOpen(false)}
        />}
    </div>
  )
}

export default NewPost