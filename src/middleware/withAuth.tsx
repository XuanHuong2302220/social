'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const withAuth = (WappedComponent : React.FC) => {
    const ProtectedComponent = (prop: any) => {
        const router = useRouter();

        useEffect(()=> {
            const token = localStorage.getItem('token');
            if(!token) {
                router.push('/login');
            }
        },[router])

        return <WappedComponent {...prop} />
    }
  return ProtectedComponent
}

export default withAuth