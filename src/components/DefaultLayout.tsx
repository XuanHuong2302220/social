import React, { useEffect} from 'react';
import Navbar from '@/components/Navbar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Conversations from './messages/Conversations';
import { addConversation, removeBoxMessage, setCountMessage, setCountNotify } from '@/redux/features/messages/messageSlice';
import { usePathname } from 'next/navigation';
import { setUserOnline } from '@/redux/features/socket/socketSlice';
import { IoNotifications } from "react-icons/io5";
import { toast } from 'react-toastify';
import { Socket } from 'socket.io-client';
import { Conversation } from '@/types';
interface LayoutProps {
  children: React.ReactNode,
  socket?: Socket
}

const Layout: React.FC<LayoutProps> = ({ children, socket }) => {

  const dispatch = useAppDispatch();

  const conversations = useAppSelector(state => state.message.boxConversation);
  const pathName = usePathname();
  const isMessagesPath = /^\/messages\/[a-zA-Z0-9-]+$/.test(pathName);
  const sound = new Audio('https://firebasestorage.googleapis.com/v0/b/talktown-a55fe.appspot.com/o/sound%2Fnotification.wav?alt=media&token=b47082f5-825e-464e-af26-401515d26532')
  const notifySound = new Audio('https://firebasestorage.googleapis.com/v0/b/talktown-a55fe.appspot.com/o/sound%2FpreviewSound.mp3?alt=media&token=89794b19-570b-4264-a885-f88e30f5af74')

  const handleGetConversation = async(conversationId: Conversation) => {
    const exsistConversation = conversations.find(conversation => conversation.id === conversationId.id);
    
    if (!exsistConversation) {
      sound.play();
      dispatch(addConversation(conversationId));
    }
    dispatch(setCountMessage(conversationId.id));
    
  }

  useEffect(() => {
    if (socket) {
      socket.on('updateUserOnline', (users) => {
        dispatch(setUserOnline(users));
      });

      socket.on('conversationUpdate', conversation => {
        handleGetConversation(conversation);
      })

      socket.on('messageCreated', (notify)=> {
        toast(notify.content, {
          icon: <IoNotifications style={{color: 'var(--primary-color)'}} />,
          style: {color: 'var(--primary-color)', backgroundColor: 'var(--navbar)'},
        })
        dispatch(setCountNotify())
        notifySound.play()
      })

      return () => {
        socket.off('updateUserOnline');
        socket.off('conversationUpdate');
        socket.off('messageCreated');
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