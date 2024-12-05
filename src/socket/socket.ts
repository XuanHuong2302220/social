import { useAppSelector } from '@/redux/hooks';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (type: string) => {
    const [socket, setSocket] = useState<Socket>();
    const token = useAppSelector(state => state.auth.token);

    useEffect(() => {
        const newSocket = io(`http://localhost:3000/${type}`, {
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
