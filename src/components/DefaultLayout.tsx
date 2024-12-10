import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Conversations from './messages/Conversations';
import { removeBoxMessage } from '@/redux/features/messages/messageSlice';
import { usePathname } from 'next/navigation';
import useSocket from '@/socket/socket';
import { setUserOnline } from '@/redux/features/socket/socketSlice';

interface LayoutProps {
  children: React.ReactNode;
  onClickLogo?: ()=> void
}

const Layout: React.FC<LayoutProps> = ({ children, onClickLogo}) => {

    const dispatch = useAppDispatch();

    const conversations = useAppSelector(state => state.message.boxConversation);
    const pathName = usePathname();
    const isMessagesPath = /^\/messages\/[a-zA-Z0-9-]+$/.test(pathName);

    const socket = useSocket('users')

    useEffect(() => {
      if (socket) {
          socket.on('updateUserOnline', (users) => {
            console.log(users);
            dispatch(setUserOnline(users));
          });

          return () => {
            socket.off('updateUserOnline');
            dispatch(setUserOnline([]));
          };
        }
      }, [socket]);

    const closeBoxMessage = (id: string) => {
      dispatch(removeBoxMessage(id));
    }

  return (
    <div className="layout relative">
      <Navbar onClickLogo={onClickLogo} />
      <main>{children}</main>
      {
       !isMessagesPath &&conversations.length > 0 && 
        conversations.map((conversation, index) => (
          <div key={conversation.receiver.id} className={`absolute z-40 w-[300px] h-[400px] rounded-t-lg rounded-b-none card shadow-2xl bg-search bottom-0 `} style={{right: `${index === 0 ? '5' : index*20 + 5}%` }}>
            <Conversations isBox closeConversation={()=>closeBoxMessage(conversation.id)} conversation={conversation} />
          </div>
        ) )
      }
    </div>
  );
};

export default Layout;