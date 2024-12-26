import { useAppSelector } from '@/redux/hooks';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (type: string) => {
    const [socket, setSocket] = useState<Socket>();
    const token = useAppSelector(state => state.auth.token);

    const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    useEffect(() => {
        const newSocket = io(`${api_url}/${type}`, {
            transports: ['websocket'],
            query: {
                token: token,
            }
        });

        setSocket(newSocket);

        // Cleanup khi component unmount
        return () => {
            newSocket.disconnect();
        };
    }, [type]);

    return socket;
};

export default useSocket;
