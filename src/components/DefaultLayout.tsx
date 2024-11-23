import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import refreshToken from '@/api/auth/refreshToken';
import { useRouter } from 'next/navigation';
import NotFound from '@/app/not-found';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children}) => {

    const token = useAppSelector(state => state.auth.token);
    const dispatch = useAppDispatch();
    const [isError, setIsError] = useState(false);
    const router = useRouter()

    useEffect(()=> {
      if(token){
        refreshToken(token, dispatch);
        setIsError(false)
      }
      else {
        setIsError(true)
      }
    }, [token, dispatch])


  return (
    <div className="layout">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;