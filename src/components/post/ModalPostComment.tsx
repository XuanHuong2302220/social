'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {Button, ChatComment, Comment, Modal, Post, SkeletonReaction} from '@/components'
import {EmojiObject, PostState } from '@/types'
import useCreateComment from '@/api/comment/createComment'
import InfiniteScroll from 'react-infinite-scroll-component'
import useGetAllComment from '@/api/comment/getAllComment'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearComments, setCurrentPage } from '@/redux/features/comment/commentSlice'

interface PostProps {
  post: PostState,
  closeFunc: () => void,
  idComment?: string
}

const ModalPostComment= ({post, closeFunc, idComment}: PostProps) => {

  const [text, setText] = useState<string>('')
  const [warningModal, setWarningModal] = useState<boolean>(false)
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number>(-1)
  const [height, setHeight] = useState<number>(150)
  const [checkReply, setCheckReply] = useState(false)

  const commentRefs = useRef<{[key: string]: HTMLDivElement | null}>({})

  const {loading, createComment} = useCreateComment(post.id ?? 0)

  const {loading: loadingGetComment, getAllComment} = useGetAllComment()

  const hasNextPage = useAppSelector(state => state.comment.hasMore)

  const comments = useAppSelector(state => state.comment.comments)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if(post.id){
      getAllComment(post.id)
    }
  },[])

  useEffect(() => {
    if (idComment && comments.length > 0) {
      const commentElement = commentRefs.current[idComment];
      if (commentElement instanceof HTMLElement) {
        commentElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      } else {
        console.log('Không thể cuộn, không phải phần tử DOM:', commentElement);
      }
    }
  }, [idComment, comments]);

  const fetchNextComments = useCallback(async()=> {
      try {
        await getAllComment(post.id ?? 0)
      }
      catch(error){
        console.error('Error when get next comment:', error)
      }
  }, [loadingGetComment, hasNextPage, getAllComment])

  const handleEmojiClick = (emojiObject: EmojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
  }

  const scroll = document.querySelector('.my-infinite-scroll-comment') as HTMLElement;
  useEffect(()=> {
    if(scroll){
      scroll.style.overflowY = 'hidden'
    }
  })

  const handleShowDropdownEdit = (index: number) => {
    setActiveDropdownIndex(index);
  };

  const handleCloseModal = () => {
    setWarningModal(false)
    setText('')
    dispatch(clearComments())
    dispatch(setCurrentPage(1))
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

  const onChange = (text: string) => {
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
                <span className='text-xl font-bold text-textColor'>{post.created_by.fullName}&apos;s Post</span>
                <button onClick={text || activeDropdownIndex !== -1 || checkReply ? ()=> setWarningModal(true) : handleCloseModal} className="btn text-textColor btn-sm btn-circle btn-ghost absolute right-2 top-">✕</button>
              </div>
              <div className='divider m-0' />
            </div>
          }
          className='overflow-hidden max-w-[600px] h-full p-0 bg-navbar'
        >
          <div className='flex flex-col h-full pt-[80px]'>
              <div className='flex flex-col overflow-auto max-h-[85%]' id='commentScroll'>
                <Post 
                  post={post}
                  disableButton
                />
                <div className='divider m-0 px-5' />

               {<div className='flex flex-col gap-3 px-5 pt-3'>
                    {comments && <InfiniteScroll
                      dataLength={comments.length}
                      loader={<SkeletonReaction />}
                      hasMore={hasNextPage}
                      next={fetchNextComments}
                      className='my-infinite-scroll-comment w-full flex flex-col gap-3'
                      scrollableTarget='commentScroll'
                    >
                      {comments.map((comment, index)=> (
                        <div
                          key={comment.id}
                          ref={(el) => { commentRefs.current[comment.id] = el; }}
                        >
                          <Comment
                            comment={comment}
                            index={index}
                            activeDropdownIndex={activeDropdownIndex}
                            handleShowDropdownEdit={handleShowDropdownEdit}
                            checkReply={checkReply}
                            setCheckReply={setCheckReply}
                            postId={post.id ?? 0}
                            idComment={idComment}
                          />
                        </div>
                      ))}

                    </InfiniteScroll>}
                </div>
                }
                { !loadingGetComment && comments && comments.length < 1 ? <h2 className='w-full py-5 text-center text-lg text-textColor font-bold'>No Comment Yet</h2> : null}

              </div>

              <div className='divider m-0 ' />

              <ChatComment 
                  loading={loading}
                  text={text}
                  handleEmojiClick={handleEmojiClick}
                  onChange={(text)=>onChange(text.target.value)}
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
              >
                <div className='flex flex-col gap-2'>
                      <Button onClick={handleCloseModal} text='Leave' className='w-full bg-transparent text-red-700' />
                      <Button onClick={()=>setWarningModal(false)} text='Cancel' className='w-full  text-textColor' />
                    </div>
               </Modal> 
                }
            </div>
        </Modal>
  )
}

export default ModalPostComment