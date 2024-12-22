import React, { useEffect} from 'react';
import Navbar from '@/components/Navbar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Conversations from './messages/Conversations';
import { addConversation, removeBoxMessage } from '@/redux/features/messages/messageSlice';
import { usePathname } from 'next/navigation';
import useSocket from '@/socket/socket';
import { setUserOnline } from '@/redux/features/socket/socketSlice';
import { IoNotifications } from "react-icons/io5";
import { toast } from 'react-toastify';
import { Socket } from 'socket.io-client';
interface LayoutProps {
  children: React.ReactNode,
  socket?: Socket
}

const Layout: React.FC<LayoutProps> = ({ children, socket }) => {

  const dispatch = useAppDispatch();

  const conversations = useAppSelector(state => state.message.boxConversation);
  const pathName = usePathname();
  const isMessagesPath = /^\/messages\/[a-zA-Z0-9-]+$/.test(pathName);

  useEffect(() => {
    if (socket) {
      socket.on('updateUserOnline', (users) => {
        dispatch(setUserOnline(users));
      });
      socket.on('conversationUpdate', conversation => {
        console.log('conversationUpdate', conversation);
        dispatch(addConversation(conversation));
      })

      socket.on('messageCreated', (notify)=> {
        toast(notify.content, {
          icon: <IoNotifications style={{color: 'var(--primary-color)'}} />,
          style: {color: 'var(--primary-color)', backgroundColor: 'var(--navbar)'},
        })
      })

      return () => {
        socket.off('updateUserOnline');
        socket.off('conversationUpdate');
        dispatch(setUserOnline([]));
      };
    }
  }, [socket]);

  const closeBoxMessage = (id: string) => {
    dispatch(removeBoxMessage(id));
  }

  return (
    <div className="layout relative">
      <Navbar />
      <main>{children}</main>
      {
        !isMessagesPath && conversations.length > 0 &&
        <div className='flex gap-3 absolute z-40 right-[5%] bottom-0'>
          {conversations.map((conversation) => (
            <div key={conversation.receiver.id} className={`w-[300px] h-[400px] rounded-t-lg rounded-b-none card shadow-2xl bg-search`} >
              <Conversations isBox closeConversation={() => closeBoxMessage(conversation.id)} conversation={conversation} userSocket={socket} />
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default Layout;