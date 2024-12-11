'use client'

import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store, persistor } from '@/redux/store';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import React, { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/user/userSlice";
import { usePathname} from "next/navigation";

export const AppContent = React.memo(({ children }: { children: React.ReactNode }) => {
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const token = useAppSelector(state => state.auth.token);
  const user = useAppSelector(selectUser);

  const pathName = usePathname();
  
  useEffect(()=> {
    if(token && !user.dob && !user.gender && pathName !== `/information/${user.username}`){
      window.location.href = `/information/${user.username}`
    }

    if((token && pathName === '/login') ||(token && pathName === '/signup') || (token && pathName === '/forgotpassword')){
      window.location.href = '/'
    }

    if(!token && pathName !== '/login' && pathName !== '/signup' && pathName !== '/forgotpassword'){
      window.location.href = '/login'
    }

  }, [token, user, pathName])

  return (
    <>
      {children}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
      />
    </>
  );
});


export default function RootLayout({ 
  children,
}: Readonly<{
  children: React.ReactNode;
}> ) {
  return (
    <html lang="en">
      <body id="root">
        <Provider store={store}>
          <PersistGate loading={<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
            </div>} persistor={persistor}>
            <AppContent>
              {children}
            </AppContent>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
