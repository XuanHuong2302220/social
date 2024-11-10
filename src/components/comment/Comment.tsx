'use client'

import React, { useEffect, useRef, useState } from 'react'
import {Avatar, Button, ChatComment, DropDown, Interact} from '@/components'
import { reactions } from '@/utils/reactions'
import { Comment as CommentInter } from '@/types'
import {calculateTimeDifference} from '@/utils/getTime'
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import useClickOutside from '@/hooks/useClickOutside'
import useUpdateComment from '@/api/comment/updateComment'
import useDeleteComment from '@/api/comment/deleteComment'
import { useAppSelector } from '@/redux/hooks'

interface CommentProps {
  comment: CommentInter,
  activeDropdownIndex?: number,
  index?: number,
  handleShowDropdownEdit?: (index: number) => void,
  checkReply?: boolean
  setCheckReply?: (isReply: boolean) => void
}

const Comment= ({comment, index, activeDropdownIndex, handleShowDropdownEdit, checkReply, setCheckReply}: CommentProps) => {

  const dropdownRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const user = useAppSelector(state => state.user)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showReaction, setShowReaction] = useState({
    color: 'text-textColor',
    name: 'Like',
  })
  const [showEdit, setShowEdit] = useState(false)
  const [showDropdownEdit, setShowDropdownEdit] = useState(false)
  const [isReply, setIsReply] = useState(false)
  const dropdownRefEdit = useRef<HTMLDivElement>(null)
  const [edit, setEdit] = useState(false)
  const [text, setText] = useState<string>(comment.content)
  const [replyComment, setReplyComment] = useState('')
  useClickOutside(dropdownRefEdit, ()=> setShowDropdownEdit(false))
  const [height, setHeight] = useState<number>(100);
  const {updateComment, loading} = useUpdateComment()
  const {deleteComment, loading: loadingDelete} = useDeleteComment()

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

  const onChange = (text: React.SetStateAction<string>) => {
    setText(text)
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
    setShowDropdownEdit(true)
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
    await deleteComment(comment.id)
    setShowDropdownEdit(false)
    setShowEdit(false)
  }

  const handleOpenReply =()=> {
    setIsReply(true)
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

  useEffect(() => {
    // const placeholderElement = document.querySelector('.public-DraftEditorPlaceholder-root');
    // if (placeholderElement && placeholderElement instanceof HTMLElement && !text) {
    //   placeholderElement.style.position = 'absolute';
    //   placeholderElement.style.top = '86%';
    // }

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

  const handleClickReaction = (name: string, color: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setShowReaction({
      name: name,
      color: color
    })
    console.log(showDropdown)
    setShowDropdown(false)

  }

  const handleOpenEdit = ()=> {
    setEdit(true)
    handleShowDropdownEdit && handleShowDropdownEdit(index ?? -1)
  }

  const handleUpdateComment = async() => {
      await updateComment(comment.id, text)
      setEdit(false)
      handleShowDropdownEdit && handleShowDropdownEdit(-1)
  }

  const handleClickDefaultReaction = () => {
    if(showReaction.color !== 'text-textColor'){
      setShowReaction({
        name: 'Like',
        color: 'text-textColor',
        })
      setShowDropdown(false)
    }
    else {
      setShowReaction({
        name: 'Like',
        color: 'text-blue-600'
      })
      setShowDropdown(false)
    }
  }

  const handleEmojiClick = (emojiObject: any) => {
    setText((prevText) => prevText + emojiObject.emoji);
  }

  const handleEmojiClickReply = (emojiObject: any) => {
    setReplyComment((prevText) => prevText + emojiObject.emoji);
  }

  return (
      <div>
        {edit && index === activeDropdownIndex ? 
          <div id='chatComment' className='flex flex-col gap-2 items-start w-full'>
            <ChatComment
              text={text}
              handleEmojiClick={handleEmojiClick}
              onChange={onChange}
              handleComment={handleUpdateComment}
              className='0'
              height={height}
              edit
              loading={loading}
              handleExit={handleClickExit}
            />
          </div> : 
        <div
            className='w-full flex gap-2 items-start relative'
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
                <div className='flex px-3 gap-2 w-[200px]'>
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
                          onClick={(reaction)=> handleClickReaction(reaction.name, reaction.color)}
                          isComment
                        />
                        }
                    </div>
                    <span className='text-sm text-textColor cursor-pointer hover:underline' onClick={handleOpenReply}>reply</span>
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
          {isReply && <div className='ml-[54px] z-50'>
            <ChatComment
              text={replyComment}
              handleEmojiClick={handleEmojiClickReply}
              onChange={(text: React.SetStateAction<string>)=>setReplyComment(text)}
              handleComment={handleUpdateComment}
              className='0'
              height={height}
              edit
              // loading={loading}
              handleExit={handleCancelRepy}
            />
          </div>}
      </div>
  )
}

export default Comment