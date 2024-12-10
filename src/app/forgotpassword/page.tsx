'use client'

import { Button, Input, Logo } from '@/components';
import React from 'react'
import { useForm } from 'react-hook-form';
import useForgotPassword from '@/api/auth/forgotPass';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';

interface FormValues {
    email: string;
}

const forgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const router = useRouter();

  const {fgPass, loading} = useForgotPassword();

  const token = useAppSelector(state => state.auth.token);

  if(token){
    return  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
    </div>
  }

  const onSubmit = async(data: any) => {
      await fgPass(data.email);
  };

  return (
    <div className='bg-gray-100 w-screen h-screen flex justify-center items-center'>
      <form onSubmit={handleSubmit(onSubmit)} className='w-1/3  bg-white rounded-lg shadow-lg p-8 '>
          <div className='w-full pb-4 flex justify-center' >
            <Logo onClick={()=> router.push('/login')} />
          </div>
          <label htmlFor='email' className='block text-gray-700 text-sm font-bold mb-2'>Email</label>
          <Input
              className='w-full h-10'
              placeholder='email'
              type='email'
              width={20}
              height={20}
              {...register('email', { required: 'email is required' })}
            />
            {errors.email && (
              <p className='text-red-600 text-sm py-1'>
                {errors.email?.message}
              </p>
            )}
        <div className='flex w-full justify-between mt-2'>
            <Button
              text='Back'
              classNameText='text-white font-bold'
              className='w-1/3 h-10 rounded-lg bg-black'
              onClick={()=> router.push('/login')}
            />
          <Button
            text={loading ? null : 'Submit'}
            type="submit"
            classNameText='text-white font-bold'
            className='w-1/3 h-10 rounded-lg bg-primaryColor border-primaryColor'
            disabled={loading}
            iconLoading={loading}
          />

        </div>
      </form>
    </div>
  )
}

export default forgotPassword;