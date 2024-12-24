'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {Button, ChatComment, Comment, Modal, Post, SkeletonReaction} from '@/components'
import {EmojiObject, PostState } from '@/types'
import useCreateComment from '@/api/comment/createComment'
import InfiniteScroll from 'react-infinite-scroll-component'
import useGetAllComment from '@/api/comment/getAllComment'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearComments, setCurrentPage } from '@/redux/features/comment/commentSlice'
import { Socket } from 'socket.io-client'

interface PostProps {
  post: PostState,
  closeFunc: () => void,
  idComment?: string,
  replyId?: string,
  setIdComment?: (id: string) => void,
  setReplyId?: (id: string) => void,
  socket?: Socket
}

const ModalPostComment= ({post, closeFunc, idComment, setIdComment, replyId, setReplyId, socket}: PostProps) => {

  const [text, setText] = useState<string>('')
  const [warningModal, setWarningModal] = useState<boolean>(false)
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<string | null>(null)
  const [checkReply, setCheckReply] = useState(false)

  const commentRefs = useRef<{[key: string]: HTMLDivElement | null}>({})

  const {loading, createComment} = useCreateComment(post.id ?? 0, socket)

  const {loading: loadingGetComment, getAllComment} = useGetAllComment()

  const hasNextPage = useAppSelector(state => state.comment.hasMore)

  const comments = useAppSelector(state => state.comment.comments) || []

  const dispatch = useAppDispatch()

  useEffect(() => {
    if(post.id){
      getAllComment(post.id)
    }
  },[])

  useEffect(() => {
    if (comments.length > 0) {
      if(idComment && !replyId){
        const commentElement = commentRefs.current[idComment];
        console.log('commentElement:', commentElement);
        if (commentElement instanceof HTMLElement) {
          commentElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          // setActiveDropdownIndex(idComment)
          setCheckReply(true)
          setIdComment && setIdComment('')
        } else {
          console.log('Không thể cuộn, không phải phần tử DOM:', commentElement);
        }
      }
      else if (idComment && replyId){
        console.log('replyId:', replyId);
        // setActiveDropdownIndex(replyId)
        setCheckReply(true)
      }
    }
  }, [comments]);

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
      scroll.style.scrollbarWidth = 'none'; // Firefox
      // Chrome, Safari, Edge
      scroll.style.setProperty('::-webkit-scrollbar', 'none');
    }
  }, [])

  const handleShowDropdownEdit = (id: string) => {
    setActiveDropdownIndex(id);
  };

  const handleCloseModal = () => {
    setWarningModal(false)
    setText('')
    dispatch(clearComments())
    dispatch(setCurrentPage(1))
    closeFunc && closeFunc()
    setReplyId && setReplyId('')
  }

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
            <div className='flex justify-center fixed items-center w-full flex-col h-[70px]'>
              <div className='flex items-center justify-center w-full h-full'>
                <span className='text-xl font-bold text-textColor'>{post.created_by.fullName}&apos;s Post</span>
                <button onClick={text || activeDropdownIndex || checkReply ? ()=> setWarningModal(true) : handleCloseModal} className="btn text-textColor btn-sm btn-circle btn-ghost absolute right-2 top-">✕</button>
              </div>
              <div className='divider m-0' />
            </div>
          }
          className='overflow-hidden max-w-[600px] h-full p-0 bg-navbar'
        >
          <div className='flex flex-col max-h-full pt-[80px]'>
              <div className='flex flex-col overflow-auto max-h-[85%]' id='commentScroll'>
                <Post 
                  post={post}
                  disableButton
                  socket={socket}
                />
                <div className='divider m-0 px-5' />

               {<div className='flex flex-col gap-3 px-5 pt-3'>
                    {comments.length > 0 && <InfiniteScroll
                      dataLength={comments.length}
                      loader={<SkeletonReaction />}
                      hasMore={hasNextPage}
                      next={fetchNextComments}
                      className='my-infinite-scroll-comment w-full flex flex-col gap-3'
                      scrollableTarget='commentScroll'
                    >
                      {comments.map((comment)=> (
                        <div
                          key={comment.id}
                          ref={(el) => { commentRefs.current[comment.id] = el; }}
                        >
                          <Comment
                            comment={comment}
                            activeDropdownIndex={activeDropdownIndex}
                            handleShowDropdownEdit={(id)=>handleShowDropdownEdit(id ?? '')}
                            checkReply={checkReply}
                            setCheckReply={setCheckReply}
                            postId={post.id ?? 0}
                            idComment={idComment}
                            replyId={replyId}
                            socket={socket}
                          />
                        </div>
                      ))}

                    </InfiniteScroll>}
                </div>
                }
                { loadingGetComment && comments.length === 0 ? <SkeletonReaction /> : !loadingGetComment && comments.length === 0 && <h2 className='w-full py-5 text-center text-lg text-textColor font-bold'>No Comment Yet</h2>}

              </div>

              <div className='divider m-0 ' />

              <ChatComment 
                  loading={loading}
                  text={text}
                  handleEmojiClick={handleEmojiClick}
                  onChange={(text)=>onChange(text.target.value)}
                  handleComment={handleSendComment}
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