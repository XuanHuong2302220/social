'use client'

import useVerifyEmail from '@/api/auth/verifyEmail';
import React, { useEffect } from 'react';

const Verify = () => {
  const { verify, loading } = useVerifyEmail();

  useEffect(() => {
    verify();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">
          {loading ? 'Verifying...' : 'Verification Result'}
        </h1>
        <div className="flex justify-center mb-6">
          {loading ? (
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          ) : (
            <div className="text-green-500 text-3xl">
              <i className="fas fa-check-circle"></i> {/* Use Font Awesome for icons */}
            </div>
          )}
        </div>
        <p className={`text-lg ${loading ? 'text-gray-500' : 'text-green-600'}`}>
          {loading ? 'Please wait while we verify your email.' : 'Your email has been verified successfully!'}
        </p>
        <div className="mt-6">
          <button className="btn btn-primary" onClick={() => window.location.href = '/login'}>
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
