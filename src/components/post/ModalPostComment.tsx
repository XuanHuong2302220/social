'use client'

import React, { useEffect, useState } from 'react'
import {Avatar, Button, Input, Modal, Post} from '@/components'
import { PostState } from '@/types'
import Image from 'next/image'
import { useAppSelector } from '@/redux/hooks'
import { selectUser } from '@/redux/features/user/userSlice'
import HighlightWithinTextarea from 'react-highlight-within-textarea'
import { IoMdSend } from "react-icons/io";

interface PostProps {
  post: PostState,
  closeFunc: () => void
}

const ModalPostComment= ({post, closeFunc}: PostProps) => {

  const user = useAppSelector(selectUser)
  const fullName = `${user.firstName} ${user.lastName}`
  const [text, setText] = useState<string>('')
  const [warningModal, setWarningModal] = useState<boolean>(false)
  const [height, setHeight] = useState<number>(150)

  useEffect(() => {
    const placeholderElement = document.querySelector('.public-DraftEditorPlaceholder-root');
    if (placeholderElement && placeholderElement instanceof HTMLElement && !text) {
      placeholderElement.style.position = 'absolute';
      placeholderElement.style.top = '86%';
    }

    const textElement = document.querySelector('#textcomment');
    if (textElement && textElement instanceof HTMLElement) {
      console.log(textElement.clientHeight)
      if(text && textElement.clientHeight > (height - 50)){
        setHeight(height + 50)
      }
      else if(!text){
        setHeight(150)
      }
      console.log(height)
    }

  }, [text]);


  const handleCloseModal = () => {
    console.log('close')
      setWarningModal(false)
      setText('')
      closeFunc && closeFunc()
  }

  const onChange = (text: React.SetStateAction<string>) => {
    setText(text)
  }

  return (
        <Modal 
          title={
            <div className='flex justify-center fixed items-center w-full flex-col  h-[70px]'>
              <div className='flex items-center justify-center w-full h-full'>
                <span className='text-xl font-bold text-textColor'>{post.created_by.fullName}'s Post</span>
                <button onClick={text ? ()=> setWarningModal(true) : handleCloseModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-">✕</button>
              </div>
              <div className='divider m-0' />
            </div>
          }
          children={
            <div className='flex flex-col h-full pt-[80px]'>
              <div className='flex flex-col overflow-auto max-h-[85%]'>
                <Post 
                  post={post}
                  disableButton
                />
                <div className='divider m-0 px-5' />

                <div>
                  Comment
                </div>

              </div>
              <div className='bg-navbar py-3' style={{ height: `${(height)}px`}}>
                <div className='divider m-0 ' />

                <div className='flex px-5 gap-1 items-start'>
                  <Avatar 
                    width={10}
                    height={10}
                    className='w-10 h-10'
                    src={user.avatar ?? ''}
                    alt={fullName}
                  />
                  <div id='textcomment' className='flex-1 w-[90%] bg-search px-3 rounded-2xl overflow-y-auto max-h-[300px]'>
                      <HighlightWithinTextarea
                        value={text}
                        highlight={[{ highlight: /#[\w]+/g, className: 'text-blue-500 bg-transparent' }]}
                        onChange={onChange}
                        placeholder='Write a comment...'
                        
                      />
                      <div className='flex justify-end p-2'>
                        <IoMdSend className='text-xl cursor-pointer' />
                      </div>
                  </div>
                </div>
                  {warningModal && <Modal
                    onClose={()=> setWarningModal(false)}
                    title={
                      <div className='flex flex-col py-2 justify-between items-center'>
                        <h3 className='text-lg font-bold text-textColor'>Leave?</h3>
                        <span className='text-sm'>Changes you made may not be saved</span>
                      </div>
                    }
                    className='w-2/3 '
                    children={
                      <div className='flex flex-col gap-2'>
                        <Button onClick={handleCloseModal} text='Leave' className='w-full bg-transparent text-red-700' />
                        <Button onClick={()=>setWarningModal(false)} text='Cancel' className='w-full  text-textColor' />
                      </div>
                    }
                />}
                </div>
            </div>
          }
          // onClose={()=> setWarningModal(true)}
          className='overflow-hidden max-w-[600px] h-full p-0 bg-navbar'
        />
  )
}

export default ModalPostComment