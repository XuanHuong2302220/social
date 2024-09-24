'use client'

import { selectUser } from '@/redux/features/user/userSlice'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const withAuth = (WappedComponent : React.FC) => {
    const ProtectedComponent = (prop: any) => {
        const router = useRouter();
        const user = useSelector(selectUser);

        const {firstName, lastName, username} = user;

        useEffect(()=> {
            const token = localStorage.getItem('token');
            if(!token) {
                router.push('/login');
            }
            else if (token && !firstName && !lastName) {
                // router.push(`/information/${username}`);
                console.log('username', username)
            }
        },[router])

        return <WappedComponent {...prop} />
    }
  return ProtectedComponent
}

export default withAuth