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
import { usePathname, useRouter } from "next/navigation";
import refreshToken from "@/api/auth/refreshToken";

const AppContent = React.memo(({ children }: { children: React.ReactNode }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const token = useAppSelector((state) => state.auth.token);
  const pathName = usePathname();
  const router =  useRouter()
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const isExcludedPage = pathName === '/login' || pathName === '/signup';
  useEffect(() => {
    if (!token && !isExcludedPage) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [token, pathName, router]);

  useEffect(()=> {
    if(token){
      refreshToken(token, dispatch);
    }
  }, [token, dispatch])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {!isExcludedPage && token && <Navbar />}
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
