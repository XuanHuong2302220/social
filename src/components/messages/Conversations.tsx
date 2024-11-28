import React, { useEffect, useRef, useState } from 'react'
import Avatar from '../Avatar'
import Input from '../input/Input'
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import useClickOutside from '@/hooks/useClickOutside';
import Message from './Message';
import { Conversation, Message as IMessage } from '@/types';
import { useAppSelector } from '@/redux/hooks';
import useGetAllMessage from '@/api/messages/getAllMessage';
import DropDown from '../DropDown';
import Button from '../Button';
import useCreateMessage from '@/api/messages/createMessage';

interface ConversationsProps {
  conversation: Conversation,
  closeConversation?: ()=> void,
  background?: string
}

const Conversations = ({conversation, closeConversation, background}: ConversationsProps) => {

  const textRef = useRef<HTMLInputElement>(null)
  const [openEmoji, setOpenEmoji] = useState(false)
  const emojiRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [dropdown, setDropdown] = useState(false)

  const messages = useAppSelector(state => state.message.boxConversation.find(con => con.id === conversation.id)?.messages ?? [])

  const messageRef = useRef<HTMLDivElement>(null)

  useEffect(()=> {
    if(messageRef.current){
      messageRef.current.scrollTop = messageRef.current.scrollHeight
    }
  }, [messages])

  const {loading, getAllMessage} = useGetAllMessage()

  const {loading: loadingMessage, createMessage} = useCreateMessage()

  useClickOutside(emojiRef, ()=> setOpenEmoji(false))
  useClickOutside(dropdownRef, ()=> setDropdown(false))

  const handleOnchange = (e: any) => {
    if(textRef.current){
      textRef.current.value = e.target.value
    }
  }

  useEffect(()=> {
    getAllMessage(conversation.id)
  }, [])

  const handleEmojiClick = (emojiObject: any) => {
    if(textRef.current){
      textRef.current.value += emojiObject.emoji
    }
  }

  const handleSendMessage = () => {
    if(textRef.current){
      const message = textRef.current.value.trim()
      if(message){
        createMessage({content: message, conversationId: conversation.id})
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
    <div className={`w-full bg-${background} h-full flex rounded-t-lg flex-col relative`}>
      <div className='px-4 flex bg-primaryColor rounded-t-lg gap-2 items-center py-3'>
        <div ref={dropdownRef}>
          <DropDown
            parents={
              <div className='w-full flex items-center hover:cursor-pointer gap-1' onClick={()=> setDropdown(!dropdown)}>
                <Avatar width={1} height={1} src={conversation.receiver.avatar ?? undefined} alt='search' className='w-8 h-8' />
                <span className='text-textColor font-bold'>{conversation.receiver.fullName}</span>
              </div>
            }
            tabIndex={0}
            classNameContent='absolute top-12 right-0 w-[200px] bg-background p-2 rounded-lg shadow-lg'
            children={
              dropdown &&
              <div className='w-full p-2 flex flex-col gap-2'>
                  <Button
                    text='View Profile'
                    className='bg-navbar text-textColor'
                    onClick={()=> window.location.href = `/${conversation.receiver.username}` }
                  />
                  <Button
                    text='View in chat'
                    className='bg-navbar text-textColor'
                    onClick={()=> window.location.href = `/messages/${conversation.id}`}
                  />
              </div>
            }
          />
        </div>
        <button className="btn btn-sm ml-auto mt-2 btn-circle text-textColor btn-ghost absolute right-2 top-2" onClick={closeConversation}>✕</button>
      </div>
      <div className='divider m-0 bg-background h-[1px]' />
      <div ref={messageRef} className={`p-2 mt-auto flex flex-col max-h-2/3 overflow-y-auto mb-4 ${(loading || (messages ?? []).length === 0) && 'justify-center items-center h-full' }`}>
         {loading &&  <span className="loading loading-spinner text-center loading-sm"></span>}
         {
            (messages ?? []).length > 0 ? (messages ?? []).map(message => (
              <Message key={message.id} message={message} />
            ))      
            : !loading && (messages ?? []).length === 0 && <div className='text-center text-textColor'>Let send a first message</div>    
         }
      </div>
      <div className='mb-2 h-[50px] w-full px-2 flex gap-3 items-center' >
        <Input type='text' onChange={handleOnchange} ref={textRef} placeholder='Aa' classInput='bg-navbar text-textColor' 
          className='w-[95%] bg-navbar'
          onKeyDown={handleKeyDown}
        />
        {loadingMessage ? <span className="loading loading-spinner text-center loading-sm"></span> :<IoMdSend className='text-2xl cursor-pointer text-textColor' onClick={handleSendMessage} />}
        <BsEmojiSmile onClick={()=>setOpenEmoji(!openEmoji)} className='cursor-pointer absolute right-[20%]' />
        <div ref={emojiRef}>
            <EmojiPicker
            open={openEmoji}
            style={{position: 'absolute'}}
            className='z-10 bottom-[10%] right-[7%]'
            width={250}
            height={350}
            theme={Theme.DARK}
            onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject)}
            />
        </div>
      </div>
    </div>
  )
}

export default Conversations