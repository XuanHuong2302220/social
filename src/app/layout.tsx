'use client'

import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store, persistor } from '@/redux/store';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { Navbar } from "@/components";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useParams, usePathname, useRouter } from "next/navigation";

function AppContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const [check, setCheck] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);
  const router = useRouter();

  useEffect(()=> {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme])

  const pathName = usePathname();
  const {id} = useParams();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
    if(pathName === `/information/${id}`){
      setCheck(true)
    }
  }, [dispatch, token]);

  return (
    <>
      {token && !check && <Navbar />}
      {children}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default function RootLayout({ 
  children,
}: Readonly<{
  children: React.ReactNode;
}> ) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
            </div>
          } persistor={persistor}>
            <AppContent>
              {children}
            </AppContent>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
