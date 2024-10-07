'use client'

import refreshToken from '@/api/auth/refreshToken'
import { selectUser } from '@/redux/features/user/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const withAuth = (WrappedComponent : React.FC) => {
    const ProtectedComponent = (prop: any) => {
        const user = useAppSelector(selectUser);
        const router = useRouter();
        const {firstName, lastName, username, id} = user;
        const token = useAppSelector((state) => state.auth.token);
        const dispatch = useAppDispatch();

        useEffect(()=> {
            
            if(!token) {
                router.push('/login');
            }
            else if (token && !firstName && !lastName) {
                refreshToken(token, dispatch);
                router.push(`/information/${username}`);
            }
            else if (token && !username){
                refreshToken(token, dispatch);
                router.push(`/information/${id}`);
            }
            else if(token){
                refreshToken(token, dispatch);
            }
        },[firstName, lastName, username, router, token])

        return <WrappedComponent {...prop} />
    }
  return ProtectedComponent
}

export default withAuth