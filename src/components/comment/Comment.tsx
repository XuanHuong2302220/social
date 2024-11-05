'use client'

import React, { useEffect, useRef, useState } from 'react'
import {Avatar, Button, DropDown, Interact} from '@/components'
import { reactions } from '@/utils/reactions'
import { Comment as CommentInter } from '@/types'
import {calculateTimeDifference} from '@/utils/getTime'
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import useClickOutside from '@/hooks/useClickOutside'

interface CommentProps {
    comment: CommentInter
}

const Comment= ({comment}: CommentProps) => {

  const dropdownRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showDropdown, setShowDropdown] = useState(false)
  const [showReaction, setShowReaction] = useState({
    color: 'text-textColor',
    name: 'Like',
  })
  const [showEdit, setShowEdit] = useState(false)
  const [showDropdownEdit, setShowDropdownEdit] = useState(false)
  const dropdownRefEdit = useRef<HTMLDivElement>(null)
  const [text, setText] = useState('')

  useClickOutside(dropdownRefEdit, ()=> setShowDropdownEdit(false))

  const loadingDelete = false

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

  const handleClickDefaultReaction = () => {
    if(showReaction.color){
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



  return (
      <div 
        className='w-full flex gap-2 items-start relative' 
        onMouseEnter={()=>setShowEdit(true)} 
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
                   <span className='text-sm font-bold cursor-pointer hover:underline w-auto'>{comment.created_by.fullName}</span>
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
                  <span className='text-sm text-textColor cursor-pointer hover:underline'>reply</span>
              </div>
          </div>

          {showEdit && <div className='z-50 absolute top-0 right-0' ref={dropdownRefEdit}>
            <DropDown
              parents={<Button
                left icon={<BsThreeDots className='text-2xl' />}
                className='bg-transparent w-[50px] h-[50px] border-transparent hover:bg-search rounded-full'
                onClick={()=>setShowDropdownEdit(!showDropdownEdit)}
              />}
              classNameContent='bg-search right-2 w-[200px] rounded-lg menu'
              children={
                showDropdownEdit &&  <div className='w-full flex flex-col'>
                <Button left icon={<MdEdit className='text-2xl' />}  onClick={() =>{setText(comment.content)}} text='Edit' className='flex items-center bg-transparent border-transparent justify-start' />
                <div className='divider m-0 bg-search'/>
                <Button left icon={!loadingDelete && <FaTrash className='text-lg' />} onClick={()=>{} } text={loadingDelete ? '' : 'Delete'} className={`flex items-center bg-transparent border-transparent ${loadingDelete ? 'justify-center' : 'justify-start '}`} iconLoading={loadingDelete} />
          </div>
              }
            />
        </div>}

      </div>
  )
}

export default Comment