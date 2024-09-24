'use client'

import React, { useState, useEffect } from 'react';
import { Input, Button, Logo } from '@/components';
import { useRouter } from 'next/navigation';
import background from '@/assets/images/background.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import useLoginApi from '@/api/loginApi';
import Link from 'next/link';
import signupApi from '@/api/signupApi';

interface FormValues {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

const SignUp = () => {

  const router = useRouter();

  const {error, signup, loading, failed} = signupApi();

  useEffect(()=> {
    const token = localStorage.getItem('token');
    if(token) {
      router.push('/');
    }
  }, [router])

  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setconfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();

  const onSubmit = async(data: FormValues) => {
    if (data) {
      await signup(data.username, data.password, data.confirmPassword, data.email);
      if (!failed) {
        reset();
        setTimeout(() => {
          router.push('/login');
        }, 5000)
      }
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
                  <p className='text-red-600 text-xs'>
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
                  <p className='text-red-600 text-xs'>
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
                  <p className='text-red-600 text-xs'>
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
                  <p className='text-red-600 text-xs'>
                    {errors.confirmPassword?.message || error}
                  </p>
                )}
            <Button
              text={loading ? null : 'Login'}
              type="submit"
              classNameText='text-white font-bold'
              className='w-3/4 h-10 rounded-lg bg-black'
              disabled={loading}
              iconLoading={loading}
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

export default SignUp;