'use client'

import React, { useEffect, useRef, useState } from 'react'
import {Avatar, Button, DropDown} from '@/components'
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import Link from 'next/link';
import { FaTrash } from "react-icons/fa";
import { PostState } from '@/types';
import {Swiper, SwiperSlide} from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { IoChevronForwardSharp } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';

interface PostProps {
  post: PostState
}

const Post: React.FC<PostProps> = ({ post }) => {

  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const swiperRef = useRef<any>(null)

  console.log(post)

  const highlightText = (text: string) => {
    const regex = /(#\w+)/g;
    return text.split(regex).map((part, index) =>
      regex.test(part) ? <span key={index} className="text-blue-500">{part}</span> : part
    );
  };

 const handleSlideChange = () => {
    if (swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning)
      setIsEnd(swiperRef.current.isEnd)
    }
 }

  return (
    <div className='card w-full flex flex-col px-5 py-3 gap-3 bg-navbar'> 
        <div className='flex w-full gap-2 items-center'>
            <Avatar width={1} height={1} alt='avatar' className='w-[42px] h-[42px]'/>
            <div className='flex flex-col'>
              <Link href={'/'} className='font-bold hover:underline text-textColor'>{post.created_by.fullName}</Link>
              <span className='text-[12px]'>20 hours ago</span>
            </div>

            <div className='ml-auto z-50'>
              <DropDown
                parents={<Button
                  left icon={<BsThreeDots className='text-2xl' />}
                  className='ml-auto bg-transparent w-[50px] h-[50px] border-transparent hover:bg-search rounded-full'
                />}
                classNameContent='bg-search right-2 w-[200px] rounded-lg menu'
                children={
                  <div className='w-full flex flex-col'>
                      <Button left icon={<MdEdit className='text-2xl' />} text='Edit Post' className='flex items-center bg-transparent border-transparent justify-start' />
                      <div className='divider m-0 bg-search'/>
                      <Button left icon={<FaTrash className='text-lg' />} text='Delete Post' className='flex items-center bg-transparent border-transparent justify-start' />
                </div>
                }
              />
            </div>
            
        </div>
        <div>{post.description && highlightText(post.description)}</div>
        <div className='h-full relative w-full'>
            <Swiper
              onSlideChange={handleSlideChange}
              ref={swiperRef}
              navigation={{
                prevEl: '.custom-prev',
                nextEl: '.custom-next',
              }}
              modules={[Navigation]}
              className='h-full swiper_post'
            >
              {post.images && post.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <Image 
                      alt={image} 
                      src={image} 
                      width={590}
                      layout="intrinsic"
                      height={0}
                      style={{ objectFit: 'cover' }} 
                      quality={100}
                    />
                </SwiperSlide>
                ) )}
            </Swiper>
            {post.images?.length > 1 ?  
              <div className={`custom-prev absolute left-2 top-1/2 transform -translate-y-1/2 z-10 `}>
                <Button left icon={<IoChevronBackOutline />} className={`bg-backgroundIcon border-backgroundIcon rounded-full p-0 w-[30px] h-[30px] min-h-[30px] ${isBeginning ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`} />
              </div> : null}
            {post.images?.length > 1 ? 
              <div className={`custom-next absolute right-2 top-1/2 transform -translate-y-1/2 z-10 `}>
              <Button left icon={<IoChevronForwardSharp />} className={`bg-backgroundIcon border-backgroundIcon opacity-100 rounded-full p-0 w-[30px] h-[30px] min-h-[30px]  ${isEnd ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`} />
            </div> : null}
        </div>
        <div>like comment</div>
    </div>
  )
}

export default Post