import { useAppSelector } from '@/redux/hooks';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '@/types';

interface ServerToClientEvents {
    messageCreated: (message: Message) => void;
}

interface ClientToServerEvents {
    sendMessage: (data: { content: string; conversationId: string }) => void;
}

const useSocket = () => {
    const token = useAppSelector((state) => state.auth.token); // Lấy token từ Redux store
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (token) {

            const newSocket = io('http://localhost:3000/messages', {
                transports: ['websocket'],
                extraHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            setSocket(newSocket);

            // Cleanup khi component unmount
            return () => {
                newSocket.disconnect();
            };
        }
    }, [token]);

    return socket;
};

export default useSocket;
