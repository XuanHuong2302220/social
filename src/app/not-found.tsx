'use client'

import { useAppSelector } from '@/redux/hooks';
import React from 'react';

const NotFound: React.FC = () => {

    const token = useAppSelector(state => state.auth.token);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-500">404</h1>
                <h2 className="mt-4 text-2xl text-gray-800">Page Not Found</h2>
                <p className="mt-2 text-gray-600">Sorry, the page you are looking for does not exist.</p>
                <a href={token ? '/' : '/login'} className="mt-6 inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                    {token ? 'Go to Home' : 'Go to Login'}
                </a>
            </div>
        </div>
    );
};

export default NotFound;
