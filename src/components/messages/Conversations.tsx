import React, { useRef, useState } from 'react'
import Avatar from '../Avatar'
import Input from '../input/Input'
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import useClickOutside from '@/hooks/useClickOutside';
import Message from './Message';

const Conversations = () => {

  const textRef = useRef<HTMLInputElement>(null)
  const [openEmoji, setOpenEmoji] = useState(false)
  const emojiRef = useRef<HTMLDivElement>(null);

  useClickOutside(emojiRef, ()=> setOpenEmoji(false))

  const handleOnchange = (e: any) => {
    if(textRef.current){
      textRef.current.value = e.target.value
    }
  }

  const handleEmojiClick = (emojiObject: any) => {
    if(textRef.current){
      textRef.current.value += emojiObject.emoji
    }
  }

  return (
    <div className='w-2/3 bg-navbar h-full flex flex-col relative'>
      <div className='px-4 flex gap-2 items-center py-3'>
        <Avatar width={1} height={1} src='' alt='search' className='w-10 h-10' />
        <span className='text-textColor font-bold'>Ngo Xuan Huong</span>
      </div>
      <div className='divider m-0 bg-background h-[1px]' />
      <div className=' p-2 mt-auto  flex flex-col max-h-2/3 overflow-y-auto mb-4'>
          <Message direction='chat-start' />
          <Message direction='chat-end' />
          <Message direction='chat-start' />
          <Message direction='chat-end' />
          <Message direction='chat-start' />
          <Message direction='chat-end' />
          <Message direction='chat-start' />
          <Message direction='chat-end' />
          <Message direction='chat-start' />
          <Message direction='chat-end' />
      </div>
      <div className='mb-2 h-[50px] w-full px-2 flex gap-3 items-center' >
        <Input type='text' onChange={handleOnchange} ref={textRef} placeholder='Aa' classInput='bg-search text-textColor' 
          className='w-[95%]'
        />
        <IoMdSend className='text-2xl cursor-pointer text-textColor' />
        <BsEmojiSmile onClick={()=>setOpenEmoji(!openEmoji)} className='cursor-pointer absolute right-[7%]' />
        <div ref={emojiRef}>
            <EmojiPicker
            open={openEmoji}
            style={{position: 'absolute'}}
            className='z-10 bottom-[10%] right-[7%]'
            width={300}
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