'use client'

import React, { useEffect, useRef, useState } from 'react'
import {Avatar} from '@/components'
import { useAppSelector } from '@/redux/hooks'
import { selectUser } from '@/redux/features/user/userSlice'
import HighlightWithinTextarea from 'react-highlight-within-textarea'
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { IoMdSend } from "react-icons/io";
import useClickOutside from '@/hooks/useClickOutside'
import { EmojiObject } from '@/types'

interface ChatCommentProps {
    text: string,
    loading?: boolean,
    className?: string,
    handleEmojiClick: (emojiObject: EmojiObject) => void,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleComment: () => void,
    height: number,
    edit?: boolean,
    handleExit?: () => void,
}

const ChatComment = ({loading,height, text, handleComment, onChange, handleEmojiClick,handleExit, className, edit}: ChatCommentProps) => {

    const user = useAppSelector(selectUser)
    const [openEmoji, setOpenEmoji] = useState(false)
    const emojiRef = useRef<HTMLDivElement>(null)

    useClickOutside(emojiRef, ()=> {
      setOpenEmoji(false);
    })

    useEffect(() => {
      const placeholderElement = document.querySelector('.public-DraftEditorPlaceholder-root');
      if (placeholderElement && placeholderElement instanceof HTMLElement && !text) {
        placeholderElement.style.position = 'absolute';
        placeholderElement.style.top = '84%';
        placeholderElement.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
      }
    }, [text]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if(text.trim() !== ''){
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleComment();
          }
        }
      };

  return (
    <div id='editComment' className={`bg-navbar py-3 w-full z-50 mb-3`} style={{ height: `${(height)}px`}}>
        <div className={`${loading && 'pointer-events-none opacity-25'} w-full flex px-5 gap-2 items-start`} style={{paddingInline : className}}>
            <Avatar 
            width={10}
            height={10}
            className='w-10 h-10 '
            id={user.id}
            src={user.avatar ?? ''}
            alt={user.avatar ?? ''}
            />
            <div id='textcomment' className='flex-1 w-[90%] bg-search px-3 rounded-2xl overflow-y-auto max-h-[400px] z-50'>
            <div onKeyDown={handleKeyDown} className='text-textColor'>
              <HighlightWithinTextarea
                  value={text}
                  highlight={[{ highlight: [/#[\w]+/g], className: 'text-blue-500 bg-transparent' }]}
                  onChange={()=>onChange}
                  placeholder={!edit ? 'Write a comment...' : undefined}
              />
            </div>
                <div className='flex justify-end p-2 gap-1 items-center'>
               {edit && <span onClick={handleExit} className='cursor-pointer mr-auto text-blue-500 font-bold text-xs z-50 hover:underline'>Cancel</span>}
                <div className={`cursor-pointer`}>
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
                    onEmojiClick={(emojiObject) => handleEmojiClick({emoji: emojiObject.emoji, name: emojiObject.names[0]})}
                    />
                </div>
                {loading ? <span className="loading loading-spinner loading-md"></span> :<IoMdSend className='text-xl cursor-pointer' onClick={handleComment} />}
            </div>
        </div>
        </div>
  </div>
  )
}

export default ChatComment