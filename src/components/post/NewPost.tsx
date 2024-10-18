'use client'

import React, { useState } from 'react'
import {Avatar, Button} from '@/components'
import { FaImages } from "react-icons/fa";
import { BsPaperclip } from "react-icons/bs";
import { AiTwotoneAudio } from "react-icons/ai";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const NewPost = () => {

  const handleShowModal = () => {
    const modal = document.getElementById('my_modal') as HTMLDialogElement
    if(modal){
      modal.showModal()
    }
  }
  return (
    <div className='card shadow-xl w-full h-[150px] bg-navbar p-4 rounded-xl' >
        <div className='h-2/4 gap-3 flex justify-between items-center w-full'>
            <Link href={'/profile'}>
              <Avatar width={1} height={1} alt='avatar' className='w-[52px] h-[52px]'/>
            </Link>
            <div className='w-full p-4 flex h-full items-center bg-search rounded-full cursor-pointer hover:opacity-50' onClick={handleShowModal}>What's on your mind?</div>
        </div>
        <div className='divider mx-0 my-1'></div>
        <div className='h-1/3 w-full justify-between flex items-center'>
            <Button left icon={<FaImages />} className='bg-transparent border-transparent' text='Image'  />
            <Button left icon={<BsPaperclip />} className='bg-transparent border-transparent' text='Attchmemt'  />
            <Button left icon={<AiTwotoneAudio />} className='bg-transparent border-transparent' text='audio'  />
            <Button text='Post' className='bg-primaryColor w-[80px] h-[40pxco] rounded-full text-white hover:bg-primaryColor hover:opacity-60 hover:text-white'  />
        </div>
    </div>
  )
}

export default NewPost