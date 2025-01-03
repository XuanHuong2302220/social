'use client'

import React, { useEffect, useRef, useState } from 'react'
import {Avatar, Button, ChatComment, DropDown, Interact, TabReactions} from '@/components'
import { reactions } from '@/utils/reactions'
import { Comment as CommentInter, EmojiObject } from '@/types'
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import useClickOutside from '@/hooks/useClickOutside'
import useUpdateComment from '@/api/comment/updateComment'
import useDeleteComment from '@/api/comment/deleteComment'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import useHandleReaction from '@/api/post/handleReaction'
import { decreaLikeComment, increaLikeComment } from '@/redux/features/comment/commentSlice'
import useCreateComment from '@/api/comment/createComment'
import useGetReactions from '@/api/post/getAllReaction'
import useGetAllComment from '@/api/comment/getAllComment'
import { decreaCountComment } from '@/redux/features/post/postSlice'
import { selectUser } from '@/redux/features/user/userSlice'
import { Socket } from 'socket.io-client'

interface CommentProps {
  comment: CommentInter,
  activeDropdownIndex?: string | null,
  handleShowDropdownEdit?: (id: string | null) => void,
  checkReply?: boolean
  setCheckReply?: (isReply: boolean) => void,
  postId: number,
  reply?: boolean,
  idComment?: string,
  replyId?: string,
  socket?: Socket
}

const Comment= ({comment, activeDropdownIndex, handleShowDropdownEdit, setCheckReply, postId, reply, idComment, replyId, socket}: CommentProps) => {

  const dropdownRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const user = useAppSelector(selectUser)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showReaction, setShowReaction] = useState({
    color: comment.isReacted ? reactions.find(reaction=> reaction.name === comment.reactionType)?.color : 'text-textColor',
    icon: comment.isReacted ? reactions.find(reaction=> reaction.name === comment.reactionType)?.icon : null,
    name: comment.isReacted ? reactions.find(reaction=> reaction.name === comment.reactionType)?.name : 'Like',
  })
  const [showEdit, setShowEdit] = useState(false)
  const [showDropdownEdit, setShowDropdownEdit] = useState(false)
  const [isReply, setIsReply] = useState(false)
  const dropdownRefEdit = useRef<HTMLDivElement>(null)
  const commentRef = useRef<HTMLDivElement>(null)
  const commentRefs = useRef<{[key: string]: HTMLDivElement | null}>({})
  const [edit, setEdit] = useState(false)
  const [text, setText] = useState<string>(comment.content)
  const [replyComment, setReplyComment] = useState('')
  const [hightLight, setHightLight] = useState<string>('')
  const {updateComment, loading} = useUpdateComment()
  const {deleteComment, loading: loadingDelete} = useDeleteComment()
  const {createReactionComment, undoReactionComment} = useHandleReaction(socket)
  const {createComment, loading: loadingReplyComment} = useCreateComment()
  const [showReactionModal, setShowReactionModal] = useState(false)
  const {loading: loadingReaction, getAllReactions, listReaction, typeReaction} = useGetReactions()
  const {loading: loadingComment, getAllComment} = useGetAllComment()
  const [isCommentCount, setIsCommentCount] = useState(true)
  const replyComments = comment.children ?? []
  const [onlineSocket, setOnlineSocket] = useState<Socket>()

  const dispatch = useAppDispatch()

  useClickOutside(dropdownRefEdit, ()=> setShowDropdownEdit(false))

  const handleClickExit = () => {
    setEdit(false)
    handleShowDropdownEdit && handleShowDropdownEdit(null)
    setShowDropdownEdit(false)
  }

  const handleCancelRepy = ()=> {
    setIsReply(false)
    setCheckReply && setCheckReply(false)
    handleShowDropdownEdit?.(null)
    setReplyComment('')
  }

  useEffect(()=> {
    if(idComment === comment.id){
      handleOpenReplycomment()
    }

    if(socket){
      setOnlineSocket(socket)
    }
  }, [])

  useEffect(()=> {
    if(replyComments.length > 0 && idComment){
      if(replyId){
        const commentElement = commentRefs.current[replyId];
        const replyElement = commentElement?.querySelector('#replyId')

        if (commentElement instanceof HTMLElement) {
          commentElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          if(replyElement instanceof HTMLElement) replyElement.click()
          setReplyComment(comment.created_by.fullName)
          setHightLight(comment.created_by.fullName)
        }
        else {
          console.log('Không thể cuộn, không phải phần tử DOM:', commentElement);
        }
      }
      else if(!replyId){
        setIsReply(true)  
        setReplyComment(comment.created_by.fullName)
        setHightLight(comment.created_by.fullName)
      }
    }
    else if (replyComments.length === 0 && idComment === comment.id && !replyId){
      setIsReply(true)
      setReplyComment(comment.created_by.fullName)
      setHightLight(comment.created_by.fullName)
    }
  }, [replyComments])

  const handleOnchange = (text: string, type: string) => {
      if (type === 'comment') {
        setText(text);
      } else {
        setReplyComment(text);
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
    if (!activeDropdownIndex) {
      setShowDropdownEdit(false);
    }
  }, [activeDropdownIndex]);

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
    if(reply && comment.parent?.id){
      await deleteComment(comment.id, comment.parent?.id)
    }
    else {
      await deleteComment(comment.id)
    }
    setShowDropdownEdit(false)
    setShowEdit(false)
    dispatch(decreaCountComment({postId}))
    handleShowDropDownEdit && handleShowDropDownEdit()
  }

  const handleOpenReply = ()=> {
    setIsReply(true)
    handleShowDropdownEdit && handleShowDropdownEdit(comment.id)
    if(comment.created_by.id !== user.id) {
      setReplyComment(comment.created_by.fullName)
      setHightLight(comment.created_by.fullName)
    }
    setCheckReply && setCheckReply(true)
  }

  const highlightText = (text: string, highlights: string[], username?: string) => {
    const regex = new RegExp(`(${highlights.join('|')}|#\\w+)`, 'gi');
    
    return text?.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line.split(regex).map((part, i) =>
          regex.test(part) ? <a href={`/${username}`} key={i} className="text-blue-500">{part}</a> : part
        )}
        <br />
      </React.Fragment>
    ));
  };

  const handleClickReaction = async(name: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
     
    if(reply && comment.parent?.id){
      dispatch(increaLikeComment({commentId: comment.id, parentId: comment.parent?.id}))
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
    handleShowDropdownEdit && handleShowDropdownEdit(comment.id)
  }

  const handleUpdateComment = async() => {
    if(reply && comment.parent?.id){
      await updateComment(comment.id, text, comment.parent?.id)
    }
    else {
      await updateComment(comment.id, text)
    }
    setEdit(false)
    handleShowDropdownEdit && handleShowDropdownEdit(null)
  }

  const handleReplyComment = async() => {
    if(comment.parent?.id){
      if(comment.commentCount < 2){
        setIsCommentCount(false)
      }
      await createComment(postId, replyComment, comment.parent?.id, comment.id, onlineSocket ?? undefined)
    }
    else {
      if(comment.commentCount < 2){
        setIsCommentCount(false)
      }
      await createComment(postId, replyComment, comment.id, undefined, socket)
    }
    setReplyComment('')
    setIsReply(false)
    setCheckReply && setCheckReply(false)
    handleShowDropdownEdit && handleShowDropdownEdit(null)
  }

  const handleClickDefaultReaction = async() => {
    if(showReaction.color !== 'text-textColor'){
      if(reply && comment.parent?.id){
        dispatch(decreaLikeComment({commentId: comment.id, parentId: comment.parent?.id}))
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
      if(reply && comment.parent?.id){
        dispatch(increaLikeComment({commentId: comment.id, parentId: comment.parent?.id}))
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

  const handleEmojiClick = (emojiObject: EmojiObject, type: string) => {
    if(type === 'comment') {
      setText((prevText) => prevText + emojiObject.emoji);
    }
    else{
      setReplyComment((prevText) => prevText + emojiObject.emoji);
    }
  }

  return (
      <div>
        {edit && activeDropdownIndex === comment.id ? 
          <div id='chatComment' className='flex flex-col gap-2 items-start w-full' >
            <ChatComment
              text={text}
              handleEmojiClick={(emojiObject)=>handleEmojiClick(emojiObject, 'comment')}
              onChange={(value) => handleOnchange(value.target.value, 'comment')}
              handleComment={handleUpdateComment}
              className='0'
              edit
              loading={loading}
              handleExit={handleClickExit}
            />
          </div> : 
        <div
            ref={commentRef}
            className='w-full flex gap-2 items-start relative pb-1'
            onMouseEnter={user.id === comment.created_by.id ? ()=> setShowEdit(true) : undefined}
          //   onMouseLeave={()=>{
          //   setShowEdit(false)
          //   setShowDropdownEdit(false)
          // }}
        >
            <a href={`/${comment.created_by.username}`}>
              <Avatar
                width={40}
                height={40}
                alt='avatar'
                id={comment.created_by.id}
                src={comment.created_by.avatar ?? ''}
                className='w-[40px] h-[40px]'
              />
            </a>
        
            <div className='flex flex-col gap-2 text-wrap break-words max-w-[80%]'>
                <div className='flex flex-col text-textColor bg-search px-3 py-1 rounded-2xl w-auto items-start max-w-full'>
                    <span className='text-xs font-bold cursor-pointer hover:underline w-auto' onClick={()=> window.location.href = `/${comment.created_by.username}`} >{comment.created_by.fullName}</span>
                    <span className='w-full'>{highlightText(comment.content, [comment.reply?.created_by.fullName ?? comment.parent?.created_by.fullName ?? 'none'], comment.reply?.created_by.username ?? comment.parent?.created_by.username ?? 'none')}</span>
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
                   <span className='text-sm text-textColor cursor-pointer hover:underline' id='replyId' onClick={handleOpenReply}>reply</span>

                    {comment.reactionCount > 0 && <div onClick={handleOpenReactions} className='ml-auto flex gap-1 items-center cursor-pointer hover:underline'>
                      <span className='text-primaryColor font-bold text-sm'>{comment.reactionCount + " react"}</span>
                      {/* <Image 
                        src={showReaction.icon} 
                        alt={showReaction.name ?? ''} 
                        width={15} 
                        height={15} 
                      /> */}
                    </div>}
                </div>
            </div>
            {showEdit  && <div className='absolute top-0 right-0' ref={dropdownRefEdit}>
              <DropDown
                parents={<Button
                  left icon={<BsThreeDots className='text-2xl' />}
                  className='bg-transparent w-[50px] h-[50px] border-transparent hover:bg-search rounded-full'
                  onClick={handleShowDropDownEdit}
                />}
                classNameContent='bg-search right-2 w-[200px] rounded-lg menu z-[1000]'
              >
                {
                  showDropdownEdit && <div className='w-full flex flex-col' style={{zIndex: 100}}>
                  <Button left icon={<MdEdit className='text-2xl' />}  onClick={handleOpenEdit} text='Edit' className='flex items-center bg-transparent border-transparent justify-start' />
                  <div className='divider m-0 bg-search'/>
                    <Button left icon={!loadingDelete && <FaTrash className='text-lg' />} onClick={handleDeleteComment} text={loadingDelete ? '' : 'Delete'} className={`flex items-center bg-transparent border-transparent ${loadingDelete ? 'justify-center' : 'justify-start '}`} iconLoading={loadingDelete} />
                </div>
                }
              </DropDown>
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

          {isReply && !comment.parent ?  <div className='ml-[54px] z-50'>
            <ChatComment
                text={replyComment}
                handleEmojiClick={(emojiObject) => handleEmojiClick(emojiObject, 'replyComment')}
                onChange={(value) => handleOnchange(value.target.value, 'replyComment')}
                handleComment={handleReplyComment}
                className='0'
                edit
                loading={loadingReplyComment}
                handleExit={handleCancelRepy}
                hightLight={hightLight}
              />
            </div>
              : isReply && comment.parent && 
              <ChatComment
                text={replyComment}
                handleEmojiClick={(emojiObject) => handleEmojiClick(emojiObject, 'replyComment')}
                onChange={(value) => handleOnchange(value.target.value, 'replyComment')}
                handleComment={handleReplyComment}
                className='0'
                edit
                loading={loadingReplyComment}
                handleExit={handleCancelRepy}
                hightLight={hightLight}
              />
            }

          <div className={`ml-[54px] z-50 items-center gap-1 ${replyComments.length > 0 && 'pt-3 '} ${loadingComment && 'flex gap-1'}`}>
            {comment.commentCount > 0 && 
                <div className='text-textColor'>
                  {isCommentCount && <span className='text-sm cursor-pointer' onClick={handleOpenReplycomment}>See all {comment.commentCount} replies</span>}
                </div>
            }
            {loadingComment ? <span className="loading loading-spinner loading-md"></span> : 
              replyComments.map((replyComment) => (
                <div ref={(el)=> {commentRefs.current[replyComment.id] = el}} key={replyComment.id} >
                  <Comment
                    comment={replyComment}
                    reply
                    postId={postId}
                    activeDropdownIndex={activeDropdownIndex}
                    handleShowDropdownEdit={(id)=>handleShowDropdownEdit && handleShowDropdownEdit(id ?? '')}
                    socket={onlineSocket}
                    setCheckReply={setCheckReply}
                  />
                </div>
              ))
            }
          </div>
      </div>
  )
}

export default Comment