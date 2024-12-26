'use client'

import React, {useRef, useState } from 'react'
import {Avatar, Button, DropDown, Interact, ModalPost, ModalPostComment, TabReactions} from '@/components'
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { InteractProps, PostState} from '@/types';
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
import useHandleReaction from '@/api/post/handleReaction';
import { Swiper as SwiperClass } from 'swiper/types'; 
import { useAppDispatch, useAppSelector} from "@/redux/hooks"
import { changeTypeReaction, decreaseLike, increaLike } from '@/redux/features/post/postSlice';
import useGetReactions from '@/api/post/getAllReaction';
import useDeletePost from '@/api/post/deletePost';
import { selectUser, setAttributes } from '@/redux/features/user/userSlice';
import useClickOutside from '@/hooks/useClickOutside';
import { Socket } from 'socket.io-client';

interface PostProps {
  post: PostState,
  disableButton?: boolean,
  width?: number,
  socket?: Socket
}

const reactions = [
  { color: 'text-blue-600' ,name: 'Like', icon: likeIcon },
  { color: 'text-red-600' ,name: 'Love', icon: loveIcon },
  { color: 'text-yellow-600' ,name: 'Haha', icon: hahaIcon },
  { color: 'text-yellow-600' ,name: 'Wow', icon: wowIcon },
  { color: 'text-yellow-600' ,name: 'Sad', icon: sadIcon },
  { color: 'text-orange-600' ,name: 'Angry', icon: angryIcon}
]

const Post: React.FC<PostProps> = ({ post, disableButton, width, socket }) => {

  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const swiperRef = useRef<SwiperClass | null>(null)
  const [modalPost, setModalPost] = useState<PostState>(post)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const optionRef = useRef<HTMLDivElement>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showOptionPost, setShowOptionPost] = useState(false)
  const [showInteract, setShowInteract] = useState<InteractProps>({
    name: post.isReacted ? post.reactionType : '',
    icon: post.isReacted ? reactions.find(r => r.name === post.reactionType)?.icon : null,
    color: post.isReacted ? reactions.find(r => r.name === post.reactionType)?.color || '' : ''
  })
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showModalReact, setShowModalReact] = useState(false);
  const [openModalComment, setOpenModalComment] = useState(false)

  const dispatch = useAppDispatch();

  const {createReaction, undoReaction} = useHandleReaction(socket)
  const {loading, getAllReactions, listReaction, typeReaction} = useGetReactions()
  const {loading: loadingDelete, deletePost} = useDeletePost()
  const user = useAppSelector(selectUser)

  useClickOutside(optionRef, ()=> setShowOptionPost(false))


  const handleOpenReaction = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setShowDropdown(true);
    }, 1500); // 1s delay
  };

  const handleClickDefault = () => {
    if(post.id){
      if(showInteract.name === '') {
        setShowInteract({ name: 'Like', icon: likeIcon, color: 'text-blue-600' })
        dispatch(changeTypeReaction({postId: post.id, type: 'Like'}))
        dispatch(increaLike({ postId: post.id }))
        setShowDropdown(false)
        if (post.id) {
          createReaction(post.id, 'Like');
        }
      }
      else {
        setShowInteract({ name: '', icon: null, color: '' })
        dispatch(decreaseLike({ postId: post.id }))
        dispatch(changeTypeReaction({postId: post.id, type: ''}))
        setShowDropdown(false)
        undoReaction(post.id);
      }
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

 const handleEditPost = (post: PostState) => {
  setModalPost(post);
  setIsModalOpen(true);
};

const handleReaction = (name: string, icon: StaticImageData, color: string) => {
  if(post.id){
    if(showInteract.name === '') {
      handleCloseReaction()
      setShowInteract({ name, icon, color })
      dispatch(increaLike({ postId: post.id }))
      dispatch(changeTypeReaction({postId: post.id, type: name}))
      setShowDropdown(false)
      createReaction(post.id, name);
    }
    else {
      handleCloseReaction()
      setShowInteract({ name, icon, color })
      dispatch(changeTypeReaction({postId: post.id, type: name}))
      setShowDropdown(false)
      createReaction(post.id, name);
    }
  }
}

const handleCloseModal = () => {
  setIsModalOpen(false);
};

const handleOpenModalReact = async()=> {
  if(post.id){
    setShowModalReact(true)
    await getAllReactions(post.id, 'post')
  }
}

const handleOpenModalComment = async(post: PostState)=>{
  if(post.id){
    setOpenModalComment(true)
    // await getAllComment(post.id)
  }
}

const handleDeletePost = (post: PostState) => {
  if(post.id){
    deletePost(post.id)
    dispatch(setAttributes({
      ...user,
      postCount: user.postCount && user.postCount  - 1
    }))
  }
}

  return (
    <div className='rounded-xl w-full flex flex-col pt-3 pb-1 gap-3 bg-navbar'> 
        <div className='flex w-full gap-2 items-center px-5'>
            <a href={`/${post.created_by.username}`}>
              <Avatar width={1} height={1} alt='avatar' src={post.created_by.avatar??''} id={post.created_by.id} className='w-[42px] h-[42px]'/>
            </a>
            <div className='flex flex-col'>
              <a href={`/${post.created_by.username}`} className='font-bold hover:underline text-textColor'>{post.created_by.fullName}</a>
              <span className='text-[12px] text-textColor'>{post.created_ago}</span>
            </div>

            {user.id === post.created_by.id && <div className='ml-auto z-30' ref={optionRef}>
              <DropDown
                parents={<Button
                  onClick={()=> setShowOptionPost(!showOptionPost)}
                  left icon={<BsThreeDots className='text-2xl' />}
                  className='ml-auto bg-transparent z-30 w-[50px] h-[50px] border-transparent hover:bg-search rounded-full'
                />}
                classNameContent='bg-search right-2 w-[200px] rounded-lg menu'
              >
               {showOptionPost&& <div className='w-full flex flex-col'>
                  <Button left icon={<MdEdit className='text-2xl' />}  onClick={() => handleEditPost(post)} text='Edit Post' className='flex items-center bg-transparent border-transparent justify-start' />
                  <div className='divider m-0 bg-search'/>
                  <Button left icon={!loadingDelete && <FaTrash className='text-lg' />} onClick={()=> handleDeletePost(post) } text={loadingDelete ? '' : 'Delete Post'} className={`flex items-center bg-transparent border-transparent ${loadingDelete ? 'justify-center' : 'justify-start '}`} iconLoading={loadingDelete} />
                </div>}
              </DropDown>
            </div>}
            
        </div>
        <div className='text-textColor px-5'>{post.description && highlightText(post.description)}</div>
        <div className='h-full relative w-full'>
            <Swiper
              onSlideChange={handleSlideChange}
              // ref={swiperRef}
              navigation={{
                prevEl: '.custom-prev',
                nextEl: '.custom-next',
              }}
              modules={[Navigation]}
              className='h-full swiper_post'
            >
              {post.images && post.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      alt={image} 
                      src={image} 
                      width={width ?? 590}
                      className='w-full h-full object-cover'
                      // layout="intrinsic"
                      height={0}
                      style={{ objectFit: 'cover' }} 
                      // quality={100}
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
        <div className='px-5'>
            <div className='flex justify-between'>
              {post.reaction_count > 0 && 
                <span onClick={handleOpenModalReact} className='text-sm flex font-bold items-center gap-1 text-textColor hover:underline cursor-pointer'>
               {post.reaction_count + " " + "React"} 
                  {/* <Image src={reactions.find((r)=> r.name === post.reactionType)?.icon ?? ''} alt={post.reactionType} width={20} height={20} /> */}
                </span>}
              {post.comment_count > 0 && <span className={`text-sm text-textColor font-bold ${post.reaction_count === 0 && 'ml-auto'}`}>{post.comment_count} Comments</span>}
            </div>
            <div className='divider m-0' />
            <div className='flex justify-around h-2/4 w-full'>
                <div ref={dropdownRef} className='relative clear-start w-1/2' 
                    onMouseEnter={handleOpenReaction}
                    onMouseLeave={handleCloseReaction}
                >
                  <Button 
                    left
                    onClick={handleClickDefault}
                    icon={showInteract.icon ? <Image src={showInteract.icon.src} alt={showInteract.name} width={25} height={25} /> : <AiOutlineLike className='text-2xl' />} 
                    text={showInteract.name || 'Like'}
                    width={25}
                    height={25}
                    className='flex items-center gap-1 border-transparent bg-navbar hover:bg-search justify-center w-full h-full'
                    classNameText={`${showInteract.color} text-lg `}
                  />
                  { showDropdown &&
                    <Interact 
                      reactions={reactions}
                      onClick={(reaction) => handleReaction(reaction.name, reaction.icon, reaction.color)}
                      backgroundColor='bg-search'
                    />
                  } 
                </div>
                <Button left icon={<FaRegComment className='text-xl' />}  text='Comment' 
                  className='flex items-center gap-1 border-transparent bg-navbar hover:bg-search justify-center w-1/2 h-full' 
                  classNameText='text-lg'
                  onClick={disableButton ? ()=>{} : ()=>handleOpenModalComment(post)}
                />
            </div>
        </div>

        {isModalOpen && (
          <ModalPost
            post={modalPost}
            onClose={handleCloseModal}
          />
        )}

        {showModalReact && (
          <TabReactions
            onClose={()=> setShowModalReact(false)}
            typeReaction={typeReaction}
            loading={loading}
            listReaction={listReaction}
          />
        )}

        {openModalComment && 
        <ModalPostComment 
          post={post}
          closeFunc={()=> setOpenModalComment(false)}
          socket={socket}
        />}
    </div>
  )
}

export default Post