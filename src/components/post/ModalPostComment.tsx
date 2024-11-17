'use client'

import React, { useEffect, useState } from 'react'
import {Button, ChatComment, Comment, Modal, Post, SkeletonReaction} from '@/components'
import { Comment as CommentInter, PostState } from '@/types'
import useCreateComment from '@/api/comment/createComment'
import { useAppDispatch } from '@/redux/hooks'
import { setCountComment } from '@/redux/features/post/postSlice'

interface PostProps {
  post: PostState,
  closeFunc: () => void,
  loadingComment?: boolean,
  comments? : CommentInter[]
}

const ModalPostComment= ({post, closeFunc, loadingComment, comments}: PostProps) => {

  const [text, setText] = useState<string>('')
  const [warningModal, setWarningModal] = useState<boolean>(false)
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number>(-1)
  const [height, setHeight] = useState<number>(150)
  const [checkReply, setCheckReply] = useState(false)
  const dispatch = useAppDispatch()

  const {loading, createComment} = useCreateComment()

  const handleEmojiClick = (emojiObject: any) => {
    setText((prevText) => prevText + emojiObject.emoji);
  }

  const handleShowDropdownEdit = (index: number) => {
    setActiveDropdownIndex(index);
  };

  const handleCloseModal = () => {
    console.log('close')
      setWarningModal(false)
      setText('')
      closeFunc && closeFunc()
  }

  useEffect(() => {
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

  const onChange = (text: React.SetStateAction<string>) => {
    setText(text)
  }

  const handleSendComment = () => {
    if(post.id && text){
      createComment(post.id, text)
      setText('')
    }
  }

  return (
        <Modal 
          title={
            <div className='flex justify-center fixed items-center w-full flex-col  h-[70px]'>
              <div className='flex items-center justify-center w-full h-full'>
                <span className='text-xl font-bold text-textColor'>{post.created_by.fullName}'s Post</span>
                <button onClick={text || activeDropdownIndex !== -1 || checkReply ? ()=> setWarningModal(true) : handleCloseModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-">✕</button>
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

               {<div className='flex flex-col gap-3 px-5 pt-3'>
                  {loadingComment ? <SkeletonReaction /> : comments && comments.map((comment, index)=> (
                    <Comment 
                      key={comment.id} 
                      comment={comment} 
                      index={index} 
                      activeDropdownIndex={activeDropdownIndex} 
                      handleShowDropdownEdit={handleShowDropdownEdit} 
                      checkReply={checkReply}
                      setCheckReply={setCheckReply}
                      postId={post.id ?? 0}
                    />    
                  ))}
                </div>
                }
                { !loadingComment && comments && comments.length < 1 ? <h2 className='w-full py-5 text-center font-bold'>No Comment Yet</h2> : null}

              </div>

              <div className='divider m-0 ' />

              <ChatComment 
                  loading={loading}
                  text={text}
                  handleEmojiClick={handleEmojiClick}
                  onChange={onChange}
                  handleComment={handleSendComment}
                  height={height}
                />
              
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
          }
          // onClose={()=> setWarningModal(true)}
          className='overflow-hidden max-w-[600px] h-full p-0 bg-navbar'
        />
  )
}

export default ModalPostComment