'use client'

import refreshToken from '@/api/auth/refreshToken'
import { selectUser } from '@/redux/features/user/userSlice'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const withAuth = (WappedComponent : React.FC) => {
    const ProtectedComponent = (prop: any) => {
        const router = useRouter();
        const user = useSelector(selectUser);

        const {firstName, lastName, username, id} = user;
        const token = localStorage.getItem('token');

        useEffect(()=> {
            
            if(!token) {
                router.push('/login');
            }
            else if (token && !firstName && !lastName) {
                refreshToken();
                router.push(`/information/${username}`);
            }
            else if (token && !username){
                refreshToken();
                router.push(`/information/${id}`);
            }
            else if(token){
                refreshToken();
            }
        },[firstName, lastName, username, router, token])

        return <WappedComponent {...prop} />
    }
  return ProtectedComponent
}

export default withAuth