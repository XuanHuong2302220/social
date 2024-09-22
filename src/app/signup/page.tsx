'use client'

import React, { useState } from 'react';
import { Input, Button, Logo } from '@/components';
import UserIcon from '@/assets/icons/user.svg';
import PasswordIcon from '@/assets/icons/password.svg';
import GoogleIcon from '@/public/icons/google.svg';
import FacebookIcon from '@/public/icons/facebook.svg';
import background from '@/assets/images/background.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import useLoginApi from '@/api/loginApi';
import Link from 'next/link';

interface FormValues {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setconfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const {error, login, loading} = useLoginApi();

  const onSubmit = (data: FormValues) => {
    if (data) {
      console.log(data);
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
          <Logo />
          <div className='w-full h-full flex flex-col justify-center items-center gap-2'>
            <div className='flex flex-col w-full items-center'>
              <span className='desktop:text-3xl laptop:text-2xl tablet:text-2xl phone:text-2xl font-bold text-black flex gap-1'>
                Get Started With 
                <span className='text-primaryColor'>SignUp</span>
              </span>
              <span className='text-sm text-black'>
                Sign up is easy and only takes a few minutes
              </span>
            </div>
            <Input
              className='w-3/4 h-10'
              placeholder='username'
              type='text'
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
                className='w-3/4 h-10'
                placeholder='email'
                type='email'
                width={20}
                height={20}
                {...register('email', { required: 'email is required' })}
              />
                {errors.email&& (
                  <p className='text-red-600'>
                    {errors.email?.message}
                  </p>
                )}

            <Input
              className='w-3/4 h-10 cursor-pointer'
              width={20}
              height={20}
              placeholder='password'
              type={showPassword ? 'text' : 'password'}
              onClick={() => setShowPassword(!showPassword)}
              iconComponent={showPassword ? <FaEyeSlash /> : <FaEye />}
              {...register('password', { required: 'Password is required' })}
            />
                {(errors.password || error) && (
                  <p className='text-red-600'>
                    {errors.password?.message || error}
                  </p>
                )}

            <Input
              className='w-3/4 h-10 cursor-pointer'
              width={20}
              height={20}
              placeholder='confirm password'
              type={confirmPassword ? 'text' : 'password'}
              onClick={() => setconfirmPassword(!confirmPassword)}
              iconComponent={confirmPassword ? <FaEyeSlash /> : <FaEye />}
              {...register('confirmPassword', { required: 'Confirm Password is required' })}
            />
                {(errors.confirmPassword || error) && (
                  <p className='text-red-600'>
                    {errors.confirmPassword?.message || error}
                  </p>
                )}
            <Button
              text='NEXT'
              type="submit"
              classNameText='text-white font-bold'
              className='w-3/4 h-10 rounded-lg bg-black'
              disabled={loading}
            />
            {loading && <span className="loading loading-dots loading-md"></span>}
            
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
              width={20}
            />
            <Button
              text='Login with Facebook'
              classNameText='text-black'
              className='w-3/4 h-10 bg-white hover:bg-gray-200'
              icon={FacebookIcon}
              height={20}
            />
            
            <div>
              <span className='text-sm'>
                Have an account?
                <Link href={'/login'} className='ml-1 text-primaryColor hover:underline hover:underline-offset-4 hover:cursor-pointer'>
                  Log in
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
