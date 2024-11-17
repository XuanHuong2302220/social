'use client'

import React, { useEffect, useRef, useState } from 'react'
import {Avatar, Button, ChatComment, DropDown, Interact, TabReactions} from '@/components'
import { reactions } from '@/utils/reactions'
import { Comment as CommentInter } from '@/types'
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import useClickOutside from '@/hooks/useClickOutside'
import useUpdateComment from '@/api/comment/updateComment'
import useDeleteComment from '@/api/comment/deleteComment'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import useHandleReaction from '@/api/post/handleReaction'
import Image from 'next/image'
import { decreaLikeComment, increaLikeComment } from '@/redux/features/comment/commentSlice'
import useCreateComment from '@/api/comment/createComment'
import useGetReactions from '@/api/post/getAllReaction'
import useGetAllComment from '@/api/comment/getAllComment'
import { decreaCountComment } from '@/redux/features/post/postSlice'

interface CommentProps {
  comment: CommentInter,
  activeDropdownIndex?: number,
  index?: number,
  handleShowDropdownEdit?: (index: number) => void,
  checkReply?: boolean
  setCheckReply?: (isReply: boolean) => void,
  postId: number,
  reply?: boolean
}

const Comment= ({comment, index, activeDropdownIndex, handleShowDropdownEdit, setCheckReply, postId, reply}: CommentProps) => {

  const dropdownRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const user = useAppSelector(state => state.user)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showReaction, setShowReaction] = useState({
    color: comment.reactionType ? reactions.find(reaction=> reaction.name === comment.reactionType)?.color : 'text-textColor',
    icon: comment.reactionType ? reactions.find(reaction=> reaction.name === comment.reactionType)?.icon : null,
    name: comment.reactionType ? reactions.find(reaction=> reaction.name === comment.reactionType)?.name : 'Like',
  })
  const [showEdit, setShowEdit] = useState(false)
  const [showDropdownEdit, setShowDropdownEdit] = useState(false)
  const [isReply, setIsReply] = useState(false)
  const dropdownRefEdit = useRef<HTMLDivElement>(null)
  const [edit, setEdit] = useState(false)
  const [text, setText] = useState<string>(comment.content)
  const [replyComment, setReplyComment] = useState('')
  const [height, setHeight] = useState<number>(100);
  const {updateComment, loading} = useUpdateComment()
  const {deleteComment, loading: loadingDelete} = useDeleteComment()
  const {createReactionComment, undoReactionComment} = useHandleReaction()
  const {createComment, loading: loadingReplyComment} = useCreateComment()
  const [showReactionModal, setShowReactionModal] = useState(false)
  const {loading: loadingReaction, getAllReactions, listReaction, typeReaction} = useGetReactions()
  const {loading: loadingComment, setReplyComments, getAllComment} = useGetAllComment()
  const [nameHightLight, setNameHightLight] = useState<string[]>([])
  const [isCommentCount, setIsCommentCount] = useState(true)
  const replyComments = comment.children ?? []
   
  const dispatch = useAppDispatch()
  
  useClickOutside(dropdownRefEdit, ()=> setShowDropdownEdit(false))

  const handleClickExit = () => {
    setEdit(false)
    handleShowDropdownEdit && handleShowDropdownEdit(-1)
    setShowDropdownEdit(false)
  }

  const handleCancelRepy = ()=> {
    setIsReply(false)
    setCheckReply && setCheckReply(false)
    setReplyComment('')
  }

  const onChange = (text: React.SetStateAction<string>, type: string) => {
    if(type === 'comment') {
      setText(text)
    }
    else {
      setReplyComment(text)
    }
  }

  const handleOpenReactions = async() => {
    if(comment.id){
      setShowReactionModal(true)
      await getAllReactions(undefined, 'comment', comment.id)
    }
  }

  const handleOpenReplycomment = async() => {
    await getAllComment(postId, comment.id)
    setIsCommentCount(false)
  }

  useEffect(()=> {
    if(showDropdownEdit){
      setText(comment.content)
    }
  }, [showDropdownEdit])

  useEffect(() => {
    if (index !== activeDropdownIndex) {
      setShowDropdownEdit(false);
    }
  }, [index, activeDropdownIndex]);

  const handleShowDropDownEdit = () => {
    setShowDropdownEdit(!showDropdownEdit)
  }

  const handleOpenReaction = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setShowDropdown(true);
    }, 1000); // 1s delay
  };

  const handleCloseReaction = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 1000); // 1s delay
  };  
  
  const handleDeleteComment = async() => {
    if(reply && comment.parentId){
      console.log(comment.id, comment.parentId)
      await deleteComment(comment.id, comment.parentId)
    }
    else {
      await deleteComment(comment.id)
    }
    setShowDropdownEdit(false)
    setShowEdit(false)
    dispatch(decreaCountComment({postId}))
  }

  const handleOpenReply = ()=> {
    setIsReply(true)
    if(comment.created_by.id !== user.id){
      setNameHightLight([comment.created_by.fullName])
      setReplyComment(comment.created_by.fullName)
    }
    setCheckReply && setCheckReply(true)
  }

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

  //set height for chat comment
  useEffect(() => {
    const textElement = document.querySelector('#textcomment');
    if (textElement && textElement instanceof HTMLElement) {
      if(text && textElement.clientHeight > (height - 50)){
        setHeight(height)
      }
      else if(!text){
        setHeight(100)
      }
    }

  }, [text]);


  const handleClickReaction = async(name: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
     
    if(reply && comment.parentId){
      dispatch(increaLikeComment({commentId: comment.id, parentId: comment.parentId}))
    }
    else {
      dispatch(increaLikeComment({commentId: comment.id}))
    }
    const matchedReaction = reactions.find(reaction => reaction.name === name)
    if(matchedReaction) {
      setShowReaction({ name: matchedReaction.name, icon: matchedReaction.icon, color: matchedReaction.color })
    }
    setShowDropdown(false)
    await createReactionComment(comment.id, name)
  }

  const handleOpenEdit = ()=> {
    setEdit(true)
    handleShowDropdownEdit && handleShowDropdownEdit(index ?? -1)
  }

  const handleUpdateComment = async() => {
    if(reply && comment.parentId){
      await updateComment(comment.id, text, comment.parentId)
    }
    else {
      await updateComment(comment.id, text)
    }
    setEdit(false)
    handleShowDropdownEdit && handleShowDropdownEdit(-1)
  }

  const handleReplyComment = async() => {
    if(comment.parentId){
      await createComment(postId, replyComment, comment.parentId, comment.id)
    }
    else {
      await createComment(postId, replyComment, comment.id,'no')
    }
    setReplyComment('')
    setIsReply(false)
    setCheckReply && setCheckReply(false)
  }

  const handleClickDefaultReaction = async() => {
    if(showReaction.color !== 'text-textColor'){
      if(reply && comment.parentId){
        dispatch(decreaLikeComment({commentId: comment.id, parentId: comment.parentId}))
      }
      else {
        dispatch(decreaLikeComment({commentId: comment.id}))
      }
      setShowReaction({
        name: 'Like',
        icon: null,
        color: 'text-textColor',
      })
      setShowDropdown(false)
      await undoReactionComment(comment.id)
    }
    else {
      if(reply && comment.parentId){
        dispatch(increaLikeComment({commentId: comment.id, parentId: comment.parentId}))
      }
      else {
        dispatch(increaLikeComment({commentId: comment.id}))
      }
      const matchedReaction = reactions.find(reaction => reaction.name === "Like")
      if(matchedReaction) {
        setShowReaction({ name: matchedReaction.name, icon: matchedReaction.icon, color: matchedReaction.color })
      }
      setShowDropdown(false)
      await createReactionComment(comment.id, "Like")
    }
  }

  const handleEmojiClick = (emojiObject: any, type: string) => {
    if(type === 'comment') {
      setText((prevText) => prevText + emojiObject.emoji);
    }
    else{
      setReplyComment((prevText) => prevText + emojiObject.emoji);
    }
  }

  return (
      <div>
        {edit && index === activeDropdownIndex ? 
          <div id='chatComment' className='flex flex-col gap-2 items-start w-full'>
            <ChatComment
              text={text}
              handleEmojiClick={(emojiObject)=>handleEmojiClick(emojiObject, 'comment')}
              onChange={(text) => onChange(text, 'comment')}
              handleComment={handleUpdateComment}
              className='0'
              height={height}
              edit
              loading={loading}
              handleExit={handleClickExit}
            />
          </div> : 
        <div
            className='w-full flex gap-2 items-start relative pb-1'
            onMouseEnter={user.id === comment.created_by.id ? ()=> setShowEdit(true) : undefined}
            onMouseLeave={()=>{
            setShowEdit(false)
            setShowDropdownEdit(false)
          }}
        >
            <Avatar
              width={40}
              height={40}
              alt='avatar'
              src={comment.created_by.avatar ?? ''}
              className='w-[40px] h-[40px]'
            />
        
            <div className='flex flex-col gap-2 text-wrap break-words max-w-[80%]'>
                <div className='flex flex-col text-textColor bg-search px-3 py-1 rounded-2xl w-auto items-start max-w-full'>
                    <span className='text-xs font-bold cursor-pointer hover:underline w-auto'>{comment.created_by.fullName}</span>
                    <span className='w-full'>{highlightText(comment.content)}</span>
                </div>
                <div className='flex px-3 gap-2 max-w-full'>
                    <span className='text-sm text-textColor'>{comment.created_ago}</span>
                    <div
                        ref={dropdownRef}
                        className='relative flex items-start'
                        onMouseEnter={handleOpenReaction}
                        onMouseLeave={handleCloseReaction}
                    >
                        <span className={`text-sm cursor-pointer hover:underline ${showReaction.color !== 'text-textColor' ? 'font-bold' : ''} ${showReaction.color}`} onClick={handleClickDefaultReaction}>{showReaction.name}</span>
                        { showDropdown &&
                        <Interact
                          reactions={reactions}
                          onClick={(reaction)=> handleClickReaction(reaction.name)}
                          isComment
                        />
                        }
                    </div>
                    <span className='text-sm text-textColor cursor-pointer hover:underline' onClick={handleOpenReply}>reply</span>

                    {comment.reactionCount > 0 && showReaction.icon && <div onClick={handleOpenReactions} className='ml-auto flex gap-1 items-center cursor-pointer hover:underline'>
                      <span className='text-textColor text-sm'>{comment.reactionCount}</span>
                      <Image 
                        src={showReaction.icon} 
                        alt={showReaction.name ?? ''} 
                        width={15} 
                        height={15} 
                      />
                    </div>}
                </div>
            </div>
            {showEdit  && <div className='z-50 absolute top-0 right-0' ref={dropdownRefEdit}>
              <DropDown
                parents={<Button
                  left icon={<BsThreeDots className='text-2xl' />}
                  className='bg-transparent w-[50px] h-[50px] border-transparent hover:bg-search rounded-full'
                  onClick={handleShowDropDownEdit}
                />}
                classNameContent='bg-search right-2 w-[200px] rounded-lg menu'
                children={
                  showDropdownEdit && <div className='w-full flex flex-col'>
                  <Button left icon={<MdEdit className='text-2xl' />}  onClick={handleOpenEdit} text='Edit' className='flex items-center bg-transparent border-transparent justify-start' />
                  <div className='divider m-0 bg-search'/>
                    <Button left icon={!loadingDelete && <FaTrash className='text-lg' />} onClick={handleDeleteComment} text={loadingDelete ? '' : 'Delete'} className={`flex items-center bg-transparent border-transparent ${loadingDelete ? 'justify-center' : 'justify-start '}`} iconLoading={loadingDelete} />
                </div>
                }
              />
          </div>}
        </div>
        }

        {showReactionModal && 
          <TabReactions 
            listReaction={listReaction}
            typeReaction={typeReaction}
            onClose={()=> setShowReactionModal(false)}
            loading={loadingReaction}
          />
        }

          {isReply && !comment.parentId ? <div className='ml-[54px] z-50'>
            <ChatComment
              text={replyComment}
              handleEmojiClick={(emojiObject) => handleEmojiClick(emojiObject, 'replyComment')}
              onChange={(text) => onChange(text, 'replyComment')}
              handleComment={handleReplyComment}
              className='0'
              height={height}
              nameReply={nameHightLight}
              edit
              loading={loadingReplyComment}
              handleExit={handleCancelRepy}
            />
          </div> : isReply && comment.parentId &&
            <ChatComment
              text={replyComment}
              handleEmojiClick={(emojiObject) => handleEmojiClick(emojiObject, 'replyComment')}
              onChange={(text) => onChange(text, 'replyComment')}
              handleComment={handleReplyComment}
              className='0'
              height={height}
              nameReply={nameHightLight}
              edit
              loading={loadingReplyComment}
              handleExit={handleCancelRepy}
            />
          }

          <div className={`ml-[54px] z-50 items-center gap-1 ${replyComments.length > 0 && 'pt-3 '} ${loadingComment && 'flex gap-1'}`}>
            {comment.commentCount > 0 && 
                <div className='text-textColor'>
                  {isCommentCount && <span className='text-sm cursor-pointer' onClick={handleOpenReplycomment}>See all {comment.commentCount} replies</span>}
                </div>
            }
            {loadingComment ? <span className="loading loading-spinner loading-md"></span> : 
              replyComments.map((replyComment, index) => (
                <Comment 
                  key={replyComment.id}
                  comment={replyComment}
                  reply
                  postId={postId}
                />
              ))
            }
          </div>
      </div>
  )
}

export default Comment