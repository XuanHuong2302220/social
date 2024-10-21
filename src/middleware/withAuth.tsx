'use client'

import refreshToken from '@/api/auth/refreshToken'
import { selectUser } from '@/redux/features/user/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const withAuth = (WrappedComponent: React.FC) => {
    const ProtectedComponent = (props: any) => {
        const user = useAppSelector(selectUser);
        const router = useRouter();
        const { firstName, lastName, username, id } = user;
        const token = useAppSelector((state) => state.auth.token);
        const dispatch = useAppDispatch();

        useEffect(() => {
            if (!token) {
                router.push('/login');
            } else {
                // Chỉ gọi refreshToken nếu cần thiết
                if (!firstName && !lastName) {
                    router.push(`/information/${username}`);
                } else if (!username) {
                    router.push(`/information/${id}`);
                }
                else {
                    router.push('/');
                    refreshToken(token, dispatch);
                }
            }
        }, [token]); 

        return <WrappedComponent {...props} />;
    };

    return ProtectedComponent;
};

export default withAuth;
