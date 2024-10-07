'use client'

import React, { useEffect, useState } from 'react';
import { Input, Button, Logo } from '@/components';
import UserIcon from '@/assets/icons/user.svg';
import PasswordIcon from '@/assets/icons/password.svg';
import GoogleIcon from '@/public/icons/google.svg';
import background from '@/assets/images/background.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import useLoginApi from '@/api/auth/loginApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { selectUser } from '@/redux/features/user/userSlice';
import { useAppSelector } from '@/redux/hooks';

interface FormValues {
  username: string;
  password: string;
}

const Login = () => {

  const router = useRouter();

  useEffect(()=> {
    const token = localStorage.getItem('token');
    if(token) {
      router.push('/');
    }
  }, [])

  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const {login, loading, loginWithGoogle} = useLoginApi();

  const onSubmit = (data: FormValues) => {
    if (data) {
      login(data.username, data.password);
    }
  };



  return (
    <div className='w-screen h-screen flex justify-center items-center text-black bg-white'>
      <div className="bg-white flex justify-center w-4/5 h-4/5 rounded-3xl">
        <form
          className='desktop:w-2/4 laptop:w-2/4 tablet:w-full phone:w-full h-full'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Link href={'/login'} className='cursor-pointer'>
            <Logo />
          </Link>
          <div className='w-full h-full flex flex-col justify-center items-center gap-2'>
            <div className='flex flex-col w-full items-center'>
              <span className='desktop:text-7xl laptop:text-5xl tablet:text-5xl phone:text-5xl font-bold text-black'>
                Welcome
              </span>
              <span className='text-sm text-black'>
                We are glad to see you back with me
              </span>
            </div>
            <Input
              className='w-3/4 h-10'
              placeholder='username or email'
              type='text'
              icon={UserIcon}
              width={20}
              height={20}
              {...register('username', { required: 'Username is required' })}
            />
                {errors.username&& (
                  <p className='text-red-600'>
                    {errors.username?.message}
                  </p>
                )}
            <Input
              className='w-3/4 h-10 cursor-pointer'
              icon={PasswordIcon}
              width={20}
              height={20}
              placeholder='password'
              type={showPassword ? 'text' : 'password'}
              onClick={() => setShowPassword(!showPassword)}
              iconComponent={showPassword ? <FaEyeSlash /> : <FaEye />}
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            />
                {(errors.password) && (
                  <p className='text-red-600'>
                    {errors.password?.message}
                  </p>
                )}

                <Link href={'/forgotpassword'} 
                  className=' w-3/4 text-right text-primaryColor hover:underline hover:underline-offset-4 hover:cursor-pointer'>
                  forgot password?
                </Link>
            <Button
              text={loading ? null : 'Next'}
              type="submit"
              classNameText='text-white font-bold'
              className='w-3/4 h-10 rounded-lg bg-black'
              disabled={loading}
              iconLoading={loading}
            />
            <div className="flex items-center w-3/4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="font-bold">
                Login<span className="font-thin"> with Others</span>
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <Button
              text='Login with Google'
              classNameText='text-black'
              className='w-3/4 h-10 bg-white hover:bg-gray-200'
              icon={GoogleIcon}
              onClick={loginWithGoogle}
              width={20}
            />
            <div>
              <span className='text-sm'>
                Don't have an account?
                <Link href={'/signup'} className='ml-1 text-primaryColor hover:underline hover:underline-offset-4 hover:cursor-pointer'>
                  Sign Up
                </Link>
              </span>
            </div>
          </div>
        </form>
        
        <div className='w-2/4 h-full desktop:flex 2xl:flex items-center justify-center tablet:hidden laptop:flex phone:hidden'>
          <Image layout='responsive' src={background} alt="background" />
        </div>
      </div>
    </div>
  );
}

export default Login;
