'use client'

import React, { useEffect, useRef, useState } from 'react'
import {Avatar, Button, DropDown, Interact, ModalPost} from '@/components'
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
import Image, { StaticImageData } from 'next/image';
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import likeIcon from '@/assets/icons/like.svg';
import loveIcon from '@/assets/icons/love.svg';
import hahaIcon from '@/assets/icons/happy.svg';
import wowIcon from '@/assets/icons/wow.svg';
import sadIcon from '@/assets/icons/sad.svg';
import angryIcon from '@/assets/icons/angry.svg';


interface PostProps {
  post: PostState
}

interface InteractProps {
  name: string;
  icon: StaticImageData | null;
  color: string;
}

const Post: React.FC<PostProps> = ({ post }) => {

  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const swiperRef = useRef<any>(null)
  const [modalPost, setModalPost] = useState<PostState>(post)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showInteract, setShowInteract] = useState<InteractProps>({
    name: '',
    icon: null,
    color: ''
  })
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenReaction = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setShowDropdown(true);
    }, 500); // 1s delay
  };

  const handleClickDefault = () => {
    if(showInteract.name === '') {
      setShowInteract({ name: 'Like', icon: likeIcon, color: 'text-blue-600' })
     setShowDropdown(false)

    }
    else {
      setShowInteract({ name: '', icon: null, color: '' })
     setShowDropdown(false)

    }
  }

  const handleCloseReaction = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 1000); // 1s delay
  };        
                  
  const highlightText = (text: string) => {
    const regex = /(#\w+)/g;
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line.split(regex).map((part, i) =>
          regex.test(part) ? <span key={i} className="text-blue-500">{part}</span> : part
        )}
        <br />
      </React.Fragment>
    ));
  };

 const handleSlideChange = () => {
    if (swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning)
      setIsEnd(swiperRef.current.isEnd)
    }
 }

//  useEffect(() => {
//   const handleMouseMove = (event: MouseEvent) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//       setShowDropdown(false);
//     }
//   };


//   document.addEventListener('mousemove', handleMouseMove);
//   return () => {
//     document.removeEventListener('mousemove', handleMouseMove);
//   };
// }, []);

 const handleEditPost = (post: PostState) => {
  setModalPost(post);
  setIsModalOpen(true);
};

const handleReaction = (name: string, icon: StaticImageData, color: string) => {
  setShowInteract({ name, icon, color })
  setShowDropdown(false)
  console.log(name, icon, color)
}

const handleCloseModal = () => {
  setIsModalOpen(false);
};

// const handleOpenReaction = () => {
//   dropdownRef.current = setTimeout(() => {
//     setShowDropdown(true);
//   }, 1000); // 1s delay
// };

const reactions = [
  { color: 'text-blue-600' ,name: 'Like', icon: likeIcon },
  { color: 'text-red-600' ,name: 'Love', icon: loveIcon },
  { color: 'text-yellow-600' ,name: 'Haha', icon: hahaIcon },
  { color: 'text-yellow-600' ,name: 'Wow', icon: wowIcon },
  { color: 'text-yellow-600' ,name: 'Sad', icon: sadIcon },
  { color: 'text-orange-600' ,name: 'Angry', icon: angryIcon}
]

  return (
    <div className='card w-full flex flex-col px-5 pt-3 pb-1 gap-3 bg-navbar'> 
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
                      <Button left icon={<MdEdit className='text-2xl' />}  onClick={() => handleEditPost(post)} text='Edit Post' className='flex items-center bg-transparent border-transparent justify-start' />
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
        <div>
            <div className='divider m-0' />
            <div className='flex justify-around h-2/4'>
            
                <div ref={dropdownRef} className='relative' 
                    onMouseEnter={handleOpenReaction}
                    onMouseLeave={handleCloseReaction}
                >
                  <Button 
                    left
                    // onMouseLeave={handleCloseReaction}
                    onClick={handleClickDefault}
                    icon={showInteract.icon ? <Image src={showInteract.icon.src} alt={showInteract.name} width={25} height={25} /> : <AiOutlineLike className='text-2xl' />} text={showInteract.name || 'Like'}
                    width={25}
                    height={25}
                    className='flex items-center gap-1 border-transparent bg-navbar hover:bg-search justify-center w-[200px] h-full'
                    classNameText={`text-lg ${showInteract.color}`}
                  />
                  { showDropdown &&
                    <Interact 
                      reactions={reactions}
                      // onMouseEnter={handleOpenReaction}
                      // onMouseLeave={handleCloseReaction}
                      onClick={(reaction) => handleReaction(reaction.name, reaction.icon, reaction.color)}
                    />
                  } 
                </div>
                <Button left icon={<FaRegComment className='text-xl' />}  text='Comment' 
                  className='flex items-center gap-1 border-transparent bg-navbar hover:bg-search justify-center w-[200px] h-full' 
                  classNameText='text-lg'
                />
            </div>
        </div>

        {isModalOpen && (
          <ModalPost
            post={modalPost}
            onClose={handleCloseModal}
          />
        )}
    </div>
  )
}

export default Post