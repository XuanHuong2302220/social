'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Avatar } from '@/components';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/features/user/userSlice';
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { IoMdSend } from "react-icons/io";
import useClickOutside from '@/hooks/useClickOutside';
import { EmojiObject } from '@/types';

interface ChatCommentProps {
  text: string;
  loading?: boolean;
  className?: string;
  handleEmojiClick: (emojiObject: EmojiObject) => void;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleComment: () => void;
  edit?: boolean;
  handleExit?: () => void;
  hightLight?: string;
}

const ChatComment = ({ loading, text, handleComment, onChange, handleEmojiClick, handleExit, className, edit,hightLight }: ChatCommentProps) => {
  const user = useAppSelector(selectUser);
  const [openEmoji, setOpenEmoji] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const [highlights, setHighlights] = useState<string[]>([]);

  useClickOutside(emojiRef, () => {
    setOpenEmoji(false);
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (text.trim() !== '') {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleComment();
      }
    }
  };

  useEffect(()=> {
    if(hightLight) {
      setHighlights([hightLight])
    }
  }, [hightLight])

  const highlightText = (text: string, highlights: string[]) => {
    const regex = new RegExp(`(${highlights.join('|')}|#\\w+)`, 'gi');
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line.split(regex).map((part, i) =>
          regex.test(part) ? <span key={i} className="text-blue-500">{part}</span> : part
        )}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div id='editComment' className={`bg-navbar py-3 w-full z-40`}>
      <div className={`${loading && 'pointer-events-none opacity-25'} w-full flex px-5 gap-2 items-start`} style={{ paddingInline: className }}>
        <Avatar
          width={10}
          height={10}
          className='w-10 h-10 '
          id={user.id}
          src={user.avatar ?? ''}
          alt={user.avatar ?? ''}
        />
        <div id='textcomment' className='flex-1 w-[90%] bg-search px-3 py-2 cursor-text rounded-2xl overflow-y-auto max-h-[400px] z-50'>
          <div onKeyDown={handleKeyDown} className='text-textColor relative'>
            <div className="absolute inset-0 pointer-events-none whitespace-pre-wrap">
              {highlightText(text, highlights)}
            </div>
            <textarea
              className='w-full bg-transparent outline-none resize-none relative z-10'
              value={text}
              onChange={(e) => onChange(e)}
              placeholder='Write a comment...'
              style={{ color: 'transparent', caretColor: 'white' }}
            />
          </div>
          <div className='flex justify-end p-2 gap-1 items-center'>
            {edit && <span onClick={handleExit} className='cursor-pointer mr-auto text-blue-500 font-bold text-xs z-50 hover:underline'>Cancel</span>}
            <div className={`cursor-pointer`}>
              <BsEmojiSmile onClick={() => setOpenEmoji(!openEmoji)} />
            </div>
            <div ref={emojiRef}>
              <EmojiPicker
                open={openEmoji}
                style={{ position: 'absolute' }}
                className='top-[265px] right-[76px] z-10'
                width={300}
                height={350}
                theme={Theme.DARK}
                onEmojiClick={(emojiObject) => handleEmojiClick({ emoji: emojiObject.emoji, name: emojiObject.names[0] })}
              />
            </div>
            {loading ? <span className="loading loading-spinner loading-md"></span> : <IoMdSend className='text-xl cursor-pointer' onClick={handleComment} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComment;