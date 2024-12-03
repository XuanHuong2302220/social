import { useAppSelector } from '@/redux/hooks';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (type: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(`http://localhost:3000/${type}`, {
            transports: ['websocket'],
        });

        setSocket(newSocket);

        // Cleanup khi component unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return socket;
};

export default useSocket;
