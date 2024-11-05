'use client'

import React, { useEffect, useRef, useState } from 'react'
import {Avatar, Button, Comment, Input, Modal, Post, SkeletonReaction} from '@/components'
import { PostState } from '@/types'
import Image from 'next/image'
import { useAppSelector } from '@/redux/hooks'
import { selectUser } from '@/redux/features/user/userSlice'
import HighlightWithinTextarea from 'react-highlight-within-textarea'
import { IoMdSend } from "react-icons/io";
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { BsEmojiSmile } from "react-icons/bs";
import useClickOutside from '@/hooks/useClickOutside'
import useCreateComment from '@/api/comment/createComment'
import useGetAllComment from '@/api/comment/getAllComment'

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
  const [openEmoji, setOpenEmoji] = useState(false)
  const emojiRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<any>(null);
  const comments = useAppSelector(state => state.comment.comments)

  const {loading, createComment} = useCreateComment()
  const {loading: loadingComment, getAllComment} = useGetAllComment()

  useEffect(() => {
    const placeholderElement = document.querySelector('.public-DraftEditorPlaceholder-root');
    if (placeholderElement && placeholderElement instanceof HTMLElement && !text) {
      placeholderElement.style.position = 'absolute';
      placeholderElement.style.top = '86%';
    }

    const textElement = document.querySelector('#textcomment');
    if (textElement && textElement instanceof HTMLElement) {
      if(text && textElement.clientHeight > (height - 50)){
        setHeight(height + 50)
      }
      else if(!text){
        setHeight(150)
      }
    }

  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if(text.trim() !== ''){
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendComment();
        // console.log(text)
      }
    }

    else {
      console.log('empty')
    }
  };

  useClickOutside(emojiRef, ()=> {
    setOpenEmoji(false);
  })

  const handleEmojiClick = (emojiObject: any) => {
    setText((prevText) => prevText + emojiObject.emoji);
  }

  const handleCloseModal = () => {
    console.log('close')
      setWarningModal(false)
      setText('')
      closeFunc && closeFunc()
  }

  const onChange = (text: React.SetStateAction<string>) => {
    setText(text)
  }

  const handleSendComment = () => {
    if(post.id && text){
      createComment(post.id, text)
      setText('')
    }
  }

  useEffect(()=> {
    if(post.id){
      getAllComment(post.id)
    }
  }, [])

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

                <div className='flex flex-col gap-3 px-5 pt-3'>
                  {loadingComment ? <SkeletonReaction /> :comments.map((comment, index)=> (
                    <Comment key={index} comment={comment} />
                  ))}
                </div>

              </div>
              <div className='bg-navbar py-3' style={{ height: `${(height)}px`}}>
                <div className='divider m-0 ' />

                <div className={`${loading && 'pointer-events-none opacity-25'} flex px-5 gap-2 items-start`}>
                  <Avatar 
                    width={10}
                    height={10}
                    className='w-10 h-10 '
                    src={user.avatar ?? ''}
                    alt={fullName}
                  />
                  <div id='textcomment' className='flex-1 w-[90%] bg-search px-3 rounded-2xl overflow-y-auto max-h-[400px]'>
                  <div onKeyDown={handleKeyDown} ref={textareaRef}>
                    <HighlightWithinTextarea
                      value={text}
                      highlight={[{ highlight: /#[\w]+/g, className: 'text-blue-500 bg-transparent' }]}
                      onChange={onChange}
                      placeholder='write a comment...'
                    />
                  </div>
                      <div className='flex justify-end p-2 items-center'>
                        <div className={`absolute left-[86%] cursor-pointer`}>
                          <BsEmojiSmile onClick={()=> setOpenEmoji(!openEmoji)} />
                        </div>
                        <div ref={emojiRef}>
                          <EmojiPicker
                            open={openEmoji}
                            style={{position: 'absolute'}}
                            className='top-[265px] right-[76px] z-10'
                            width={300}
                            height={350}
                            theme={Theme.DARK}
                            onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject)}
                          />
                        </div>
                        {loading ? <span className="loading loading-spinner loading-md"></span> :<IoMdSend className='text-xl cursor-pointer' onClick={handleSendComment} />}
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