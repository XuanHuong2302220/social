'use client'

import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store, persistor } from '@/redux/store';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { Navbar } from "@/components";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/user/userSlice";
import { usePathname, useRouter } from "next/navigation";

const AppContent = React.memo(({ children }: { children: React.ReactNode }) => {
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const token = useAppSelector(state => state.auth.token);
  const user = useAppSelector(selectUser);
  const router = useRouter();

  const pathName = usePathname();
  
  useEffect(()=> {
    if(token && !user.firstName && !user.lastName){
      router.push(`/information/${user.username}`)
    }

    if((token && pathName === '/login') ||(token && pathName === '/signup') || (token && pathName === '/forgotpassword')){
      router.push('/')
    }

  }, [token, user])

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

export { AppContent };

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
