'use client'

import refreshToken from '@/api/auth/refreshToken'
import { selectUser } from '@/redux/features/user/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const withAuth = (WrappedComponent: React.FC) => {
    const ProtectedComponent = (props: any) => {
        const user = useAppSelector(selectUser);
        const router = useRouter();
        const { firstName, lastName, username, id } = user;
        const token = useAppSelector((state) => state.auth.token);
        const dispatch = useAppDispatch();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            if(token){
                let redirectUrl = '/';
                if (!firstName && !lastName) {
                    redirectUrl = `/information/${username}`;
                } else if (!username) {
                    redirectUrl = `/information/${id}`;
                }
                router.push(redirectUrl);
                refreshToken(token, dispatch).finally(() => setLoading(false));
                }
            else {
                router.push('/login');
                setLoading(false);
            }
        }, [token, firstName, lastName, username, id, router, dispatch]);
        
        if (loading) {
            return(
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
            </div>)
        }

        return <WrappedComponent {...props} />;
    };

    return ProtectedComponent;
};

export default withAuth;
