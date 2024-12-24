import React, { useEffect, useRef, useState } from 'react'
import Avatar from '../Avatar'
import Input from '../input/Input'
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import useClickOutside from '@/hooks/useClickOutside';
import Message from './Message';
import { Conversation, EmojiObject} from '@/types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import useGetAllMessage from '@/api/messages/getAllMessage';
import DropDown from '../DropDown';
import Button from '../Button';
import useCreateMessage from '@/api/messages/createMessage';
import { selectUser } from '@/redux/features/user/userSlice';
import {  usePathname } from 'next/navigation';
import { Socket } from 'socket.io-client';
import { decreaCountMessage } from '@/redux/features/messages/messageSlice';
interface ConversationsProps {
  conversation: Conversation,
  closeConversation?: ()=> void,
  background?: string,
  isBox?: boolean,
  loadingMess?: boolean,
  userSocket?: Socket
}

const Conversations = ({conversation, closeConversation, background, isBox, loadingMess, userSocket}: ConversationsProps) => {

  const textRef = useRef<HTMLInputElement>(null)
  const [openEmoji, setOpenEmoji] = useState(false)
  const emojiRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null)
  const countMessage = useAppSelector(state => state.message.countMessage)

  const user = useAppSelector(selectUser)

  const [dropdown, setDropdown] = useState(false)

  const messages = useAppSelector((state) => {
    if (isBox) {
      return state.message.boxConversation.find(con => con.id === conversation?.id)?.messages ?? [];
    } else {
      return state.message.conversations.find(con => con.id === conversation?.id)?.messages ?? [];
    }
  });

  const messageRef = useRef<HTMLDivElement>(null)

  const pathName = usePathname();
  const isMessagesPath = /^\/messages\/[a-zA-Z0-9-]+$/.test(pathName);

  const dispatch = useAppDispatch()

  useEffect(()=> {
    if(messageRef.current){
      messageRef.current.scrollTop = messageRef.current.scrollHeight
    }
  }, [messages])

  const {loading, getAllMessage} = useGetAllMessage()

  const {loading: loadingMessage, createMessage} = useCreateMessage(conversation.id, userSocket)

  useClickOutside(emojiRef, ()=> setOpenEmoji(false))
  useClickOutside(dropdownRef, ()=> setDropdown(false))

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(textRef.current){
      textRef.current.value = e.target.value
    }
  }

  useEffect(()=> {
    if(conversation?.id){
      getAllMessage(conversation?.id)
    }
  }, [conversation?.id])

  const handleEmojiClick = (emojiObject: EmojiObject) => {
    if(textRef.current){
      textRef.current.value += emojiObject.emoji
    }
  }

  const handleForcus = () => {
    const index = countMessage.findIndex(id => id === conversation.id)
    if(index !== -1){
      dispatch(decreaCountMessage(conversation.id))
    }
  }

  const handleSendMessage = () => {
    if(textRef.current){
      const message = textRef.current.value.trim()
      if(message && user.id){
        createMessage({content: message, idConversation: conversation.id, senderId:user.id})
        textRef.current.value = ''
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(textRef.current){
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    }
  }

  return (
    <div className={`w-full bg-${background} h-full flex flex-col relative ${!isMessagesPath ? 'rounded-t-lg' : ''}`}>
      <div className={`px-4 flex bg-primaryColor gap-2 items-center py-3 ${!isMessagesPath ? 'rounded-t-lg' : ''}`}>
        {!isMessagesPath ? <div ref={dropdownRef}>
          <DropDown
            parents={
              <div className='w-full flex items-center hover:cursor-pointer gap-1' onClick={()=> setDropdown(!dropdown)}>
                <Avatar width={1} id={conversation?.sender.id === user.id ? conversation?.receiver.id : conversation?.sender.id} height={1} src={conversation?.sender.id === user.id ? conversation?.receiver.avatar ?? undefined : conversation?.sender.avatar ?? undefined} alt='search' className='w-8 h-8' />
                <span className='text-textColor font-bold'>{conversation?.sender.id === user.id ? conversation?.receiver.fullName : conversation?.sender.fullName}</span>
              </div>
            }
            tabIndex={0}
            classNameContent='absolute top-12 left-0 w-[200px] z-50 bg-background p-2 rounded-lg shadow-lg'
            className='z-50'>
            {
              dropdown &&
              <div className='w-full p-2 flex flex-col gap-2'>
                  <Button
                    text='View Profile'
                    className='bg-navbar text-textColor'
                    onClick={()=> window.location.href = `/${conversation?.receiver.username}`}
                  />
                  <Button
                    text='View in chat'
                    className='bg-navbar text-textColor'
                    onClick={()=> window.location.href = `/messages/${conversation?.id}`}
                  />
              </div>
            }
            </DropDown>
        </div> : 
        <div className='w-full flex items-center hover:cursor-pointer gap-1' onClick={()=> setDropdown(!dropdown)}>
          <Avatar width={1} height={1} id={conversation?.sender.id === user.id ? conversation?.receiver.id : conversation?.sender.id} src={conversation?.sender.id === user.id ? conversation?.receiver.avatar ?? undefined : conversation?.sender.avatar ?? undefined} alt='search' className='w-8 h-8' />
          <span className='text-textColor font-bold'>{conversation?.sender.id === user.id ? conversation?.receiver.fullName : conversation?.sender.fullName}</span>
        </div>}
       {!isMessagesPath && <button className="btn btn-sm ml-auto mt-2 btn-circle text-textColor btn-ghost absolute right-2 top-2" onClick={closeConversation}>✕</button>}
      </div>
      <div className='divider m-0 bg-background h-[1px]' />
      <div ref={messageRef} className={`p-3 mt-auto flex flex-col max-h-2/3 overflow-y-auto mb-4 ${(loading || loadingMess || messages.length === 0) && 'justify-center items-center h-full' }`}>
         {loading && <span className="loading loading-spinner text-center loading-sm"></span>}
         {
            !loading && !loadingMess && messages.length > 0 ? messages.map(message => (
              <Message key={message.id} message={message} />
            ))      
            : !loading && messages.length === 0 && <div className='text-center text-textColor'>Let send a first message</div>    
         }
      </div>
      <div className='mb-2 h-[50px] w-full px-2 flex gap-3 items-center' >
        <Input type='text' onChange={handleOnchange} ref={textRef} placeholder='Aa' classInput='bg-navbar text-textColor' 
          className='w-[95%] bg-navbar'
          onKeyDown={handleKeyDown}
          onFocus={handleForcus}
        />
        {loadingMessage ? <span className="loading loading-spinner text-center loading-sm"></span> :<IoMdSend className='text-2xl cursor-pointer text-textColor' onClick={handleSendMessage} />}
        <BsEmojiSmile onClick={()=>setOpenEmoji(!openEmoji)} className={`cursor-pointer absolute right-[${isBox ? '20%' : '7%'}]`} style={{ right: isBox ? '20%' : '7%' }} />
        <div ref={emojiRef}>
            <EmojiPicker
            open={openEmoji}
            style={{position: 'absolute'}}
            className='z-10 bottom-[10%] right-[7%]'
            width={250}
            height={350}
            theme={Theme.DARK}
            onEmojiClick={(emojiObject) => handleEmojiClick({emoji: emojiObject.emoji, name: emojiObject.names[0]})}
            />
        </div>
      </div>
    </div>
  )
}

export default Conversations