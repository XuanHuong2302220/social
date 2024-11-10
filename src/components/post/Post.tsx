'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {Avatar, Button, DropDown, Interact, Modal, ModalPost, ModalPostComment, SkeletonReaction, Tabs} from '@/components'
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import Link from 'next/link';
import { FaTrash } from "react-icons/fa";
import { InteractProps, PostState, Reaction } from '@/types';
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
import { useAppDispatch, useAppSelector} from "@/redux/hooks"
import { decreaseLike, increaLike } from '@/redux/features/post/postSlice';
import useGetReactions from '@/api/post/getAllReaction';
import useDeletePost from '@/api/post/deletePost';
import { calculateTimeDifference } from '@/utils/getTime';
import useGetAllComment from '@/api/comment/getAllComment';

interface PostProps {
  post: PostState,
  disableButton?: boolean
}
interface ReactionProps {
  type: InteractProps;
  count: number;
}

const Post: React.FC<PostProps> = ({ post, disableButton }) => {

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
  const [showModalReact, setShowModalReact] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [headerReaction, setHeaderReaction] = useState<ReactionProps[]>([{
    type: {
      name: 'All',
      icon: null,
      color: ''
    },
    count: 0
  }])
  const [getListReaction, setListReaction] = useState<Reaction[]>([])
  const [cloneListReaction, setCloneListReaction] = useState<Reaction[]>([])
  const [openModalComment, setOpenModalComment] = useState(false)
  const [postComment, setPostComment] = useState<PostState>(post)
  const {loading: loadingComment, getAllComment} = useGetAllComment()

  const dispatch = useAppDispatch();

  const {createReaction, undoReaction} = useHandleReaction()
  const {loading, getAllReactions, listReaction, typeReaction} = useGetReactions()
  const {loading: loadingDelete, deletePost} = useDeletePost()
  const comments = useAppSelector(state => state.comment.comments)
  
const reactions = [
    { color: 'text-blue-600' ,name: 'Like', icon: likeIcon },
    { color: 'text-red-600' ,name: 'Love', icon: loveIcon },
    { color: 'text-yellow-600' ,name: 'Haha', icon: hahaIcon },
    { color: 'text-yellow-600' ,name: 'Wow', icon: wowIcon },
    { color: 'text-yellow-600' ,name: 'Sad', icon: sadIcon },
    { color: 'text-orange-600' ,name: 'Angry', icon: angryIcon}
]

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
    if(post.id){
      if(showInteract.name === '') {
        setShowInteract({ name: 'Like', icon: likeIcon, color: 'text-blue-600' })
        dispatch(increaLike({ postId: post.id }))
        setShowDropdown(false)
        if (post.id !== null) {
          createReaction(post.id, 'Like');
        }
      }
      else {
        setShowInteract({ name: '', icon: null, color: '' })
        dispatch(decreaseLike({ postId: post.id }))
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
      setShowInteract({ name, icon, color })
      console.log(color)
      dispatch(increaLike({ postId: post.id }))
      setShowDropdown(false)
      createReaction(post.id, name);
    }
    else {
      setShowInteract({ name, icon, color })
      setShowDropdown(false)
      createReaction(post.id, name);
    }
  }
}

const handleCloseModal = () => {
  setIsModalOpen(false);
};

useEffect(()=> {
  if(post.id){
    setHeaderReaction(prevState => [
      ...prevState, 
      ...typeReaction.flat().map(reaction => {
        const matchedReaction = reactions.find(r => r.name === reaction.type);
        if(matchedReaction)
          return {
            type: {
              name: matchedReaction.name,
              icon: matchedReaction.icon,
              color: matchedReaction.color
            },
            count: reaction.count
          };
      }).filter((reaction): reaction is ReactionProps => reaction !== undefined)
    ])
  }

}, [typeReaction])

const handleOpenModalReact = async()=> {
  if(post.id){
    setShowModalReact(true)
    setActiveTab(0)
    await getAllReactions(post.id)
  }
}

useEffect(()=> {
  if(post.id){
    setListReaction(listReaction)
    setCloneListReaction(listReaction)
  }
}, [listReaction])

const handleCloseModalReactions = () => {
  setShowModalReact(false);
  setHeaderReaction([{
    type: {
      name: 'All',
      icon: null,
      color: ''
    },
    count: 0
  }])
  setListReaction([])
}

useEffect(()=> {
  if(post.reactionType) {
      const matchedReaction = reactions.find(reaction => reaction.name === post.reactionType)
      if(matchedReaction) {
        setShowInteract({ name: matchedReaction.name, icon: matchedReaction.icon, color: matchedReaction.color })
      }
  }
}, [])

const handleOpenModalComment = async(post: PostState)=>{
  if(post.id){
    setOpenModalComment(true)
    setPostComment(post)
    await getAllComment(post.id)
  }
}

const handleSelectReaction =(index: number, type: string) => {
  if(post.id ){
    setActiveTab(index)
    console.log(index)
    if(index !== 0) {
      setListReaction(()=>listReaction.filter(reaction => reaction.reaction_type === type))
    }
    else if(index === 0) {
      setListReaction(cloneListReaction)
    }
  }
}

const handleDeletePost = (post: PostState) => {
  if(post.id){
    deletePost(post.id)
  }
}

  return (
    <div className='card w-full flex flex-col px-5 pt-3 pb-1 gap-3 bg-navbar'> 
        <div className='flex w-full gap-2 items-center'>
            <Avatar width={1} height={1} alt='avatar' className='w-[42px] h-[42px]'/>
            <div className='flex flex-col'>
              <Link href={'/'} className='font-bold hover:underline text-textColor'>{post.created_by.fullName}</Link>
              <span className='text-[12px]'>{post.created_ago}</span>
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
                      <Button left icon={!loadingDelete && <FaTrash className='text-lg' />} onClick={()=> handleDeletePost(post) } text={loadingDelete ? '' : 'Delete Post'} className={`flex items-center bg-transparent border-transparent ${loadingDelete ? 'justify-center' : 'justify-start '}`} iconLoading={loadingDelete} />
                </div>
                }
              />
            </div>
            
        </div>
        <div className='text-textColor'>{post.description && highlightText(post.description)}</div>
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
            <div className='flex justify-between'>
              {post.reaction_count > 0 && <span onClick={handleOpenModalReact} className='text-[14px] text-textColor hover:underline cursor-pointer'>{post.reaction_count} Reactions</span>}
              {post.comment_count > 0 && <span className='text-[14px] text-textColor'>{post.comment_count} Comments</span>}
            </div>
            <div className='divider m-0' />
            <div className='flex justify-around h-2/4'>
            
                <div ref={dropdownRef} className='relative' 
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
                    className='flex items-center gap-1 border-transparent bg-navbar hover:bg-search justify-center w-[200px] h-full'
                    classNameText={`${showInteract.color} text-lg `}
                  />
                  { showDropdown &&
                    <Interact 
                      reactions={reactions}
                      onClick={(reaction) => handleReaction(reaction.name, reaction.icon, reaction.color)}
                    />
                  } 
                </div>
                <Button left icon={<FaRegComment className='text-xl' />}  text='Comment' 
                  className='flex items-center gap-1 border-transparent bg-navbar hover:bg-search justify-center w-[200px] h-full' 
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
          <Modal
            onClose={handleCloseModalReactions}
            closeIcon
            children={
              
              <div className='flex flex-col'>
                <div role="tablist" className="tabs tabs-bordered flex ">
                  {headerReaction.map((reaction, index)=> (
                    <Button 
                      key={index}
                      left
                      icon={reaction.type.icon && <Image src={reaction.type.icon.src} alt={reaction.type.name} width={25} height={25} /> }
                      text={`${reaction.count > 0 ? reaction.count : reaction.type.name}`}
                      className={`border-transparent rounded-none tab w-[100px] bg-transparent ${activeTab === index ? 'tab-active' : ''}`}
                      onClick={()=>handleSelectReaction(index, reaction.type.name)}
                      disabled={activeTab === index}
                    />
                  ))}
                </div>
                  { activeTab && 
                     loading ? <SkeletonReaction /> :
                     getListReaction.map((reaction, index) => (
                          <div key={index} className='flex gap-2 items-center justify-between py-2'>
                          <div className='flex gap-2 items-center'>
                            <Avatar width={1} height={1} alt='avatar' className='w-[42px] h-[42px]'/>
                            <div className='flex flex-col'>
                              <Link href={'/'} className='font-bold hover:underline text-textColor'>{reaction.user.fullName}</Link>
                              {/* <span className='text-[12px]'>20 hours ago</span> */}
                            </div>
                          </div>
                          <div className='flex gap-2 items-center'>
                            <Image src={reactions.find(r => r.name === reaction.reaction_type)?.icon.src} alt={reaction.reaction_type} width={30} height={30} />
                          </div>
                        </div>
                        ))}
                </div>
              
            }
          />
        )}

        {openModalComment && <ModalPostComment 
            post={postComment}
            closeFunc={()=> setOpenModalComment(false)}
            loadingComment={loadingComment}
            comments={comments}
        />}
    </div>
  )
}

export default Post
