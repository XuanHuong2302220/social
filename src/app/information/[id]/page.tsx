'use client'

import { Button, Input, Logo } from '@/components';
import React from 'react'
import { useForm } from 'react-hook-form';
import { selectUser } from '@/redux/features/user/userSlice';
import { useSelector } from 'react-redux';
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css'; // Import CSS cho rsuite

interface FormValues {
  firstName: string;
  lastName: string;
  dob: string;
  gender: ['famale', 'male'];
}

const forgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const user = useSelector(selectUser);


  console.log(user);

  const onSubmit = async(data: any) => {
      console.log(data);
  };

  return (
    <div className='bg-gray-100 w-screen h-screen flex justify-center items-center'>
      <form onSubmit={handleSubmit(onSubmit)} className='w-2/4  bg-white rounded-lg shadow-lg p-8 flex flex-col gap-2'>
          <div className='w-full pb-4 flex justify-center' >
            <Logo />
          </div>
          <div className='w-full flex gap-2'>
            <div className='flex flex-col w-1/2'>
              <label className='block text-gray-700 text-sm font-bold mb-2 w-1/2'>First Name</label>
              <Input
                  className='w-full h-10'
                  placeholder='First Name'
                  type='First Name'
                  width={20}
                  height={20}
                  {...register('firstName', { required: 'firstName is required' })}
                />
                {errors.firstName && (
                  <p className='text-red-600 text-sm py-1'>
                    {errors.firstName?.message}
                  </p>
                )}
            </div>

            <div className='flex flex-col w-1/2'>
              <label className='block text-gray-700 text-sm font-bold mb-2'>Last Name</label>
              <Input
                  className='w-full h-10'
                  placeholder='Last Name'
                  type='Last Name'
                  width={20}
                  height={20}
                  {...register('lastName', { required: 'lastName is required' })}
                />
                {errors.lastName && (
                  <p className='text-red-600 text-sm py-1'>
                    {errors.lastName?.message}
                  </p>
                )}
            </div>
          </div>
          <div>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Date of Birth</label>
            <DatePicker
              className="w-full h-10"
            />
          </div>
          <div>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Gender</label>
            <select className="select w-full bg-gray-200 select-bordered">
              <option disabled selected>Female</option>
              <option>Male</option>
            </select>
          </div>
          <div>
          
          </div>
        <div className='flex w-full justify-end mt-2'>
          <Button
            text={ 'Submit'}
            type="submit"
            classNameText='text-white font-bold'
            className='w-1/3 h-10 rounded-lg bg-black right'
            // disabled={loading}
            // iconLoading={loading}
          />
        </div>
      </form>
    </div>
  )
}

export default forgotPassword;