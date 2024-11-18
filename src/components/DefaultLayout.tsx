import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import refreshToken from '@/api/auth/refreshToken';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children}) => {

    const token = useAppSelector(state => state.auth.token);
    const dispatch = useAppDispatch();

    useEffect(()=> {
      if(token){
        refreshToken(token, dispatch);
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