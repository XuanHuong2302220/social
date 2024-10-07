'use client'

import { Button, Input, Logo } from '@/components';
import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { selectUser } from '@/redux/features/user/userSlice';
import { useSelector } from 'react-redux';
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css'; // Import CSS cho rsuite
import { useParams, useRouter } from 'next/navigation';
import updateUser from '@/api/auth/updateUser';
import withAuth from '@/middleware/withAuth';
import { useAppSelector } from '@/redux/hooks';

interface FormValues {
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'female' | 'male'
}

const information = () => {
  const { register, handleSubmit,control, formState: { errors } } = useForm<FormValues>();
  const user = useAppSelector(selectUser);
  const router = useRouter();
  let token = localStorage.getItem('token') || '';
  
  if(token){
      token = token.replace(/['"]+/g, '')
  }

  const {id} = useParams();

  const calculateMinDate = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
    return minDate;
  };

  const {loading, update} = updateUser();
 
  useEffect(()=> {
    if(id === user.username || id === user.id){
        return;
    }
    else {
       router.push('/not-found');
    }
  }, [])

  const onSubmit = async(data: any) => {
      console.log(data)
      await update(data)
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
            <Controller
              name="dob"
              control={control}
              defaultValue={''} 
              rules={{ required: 'Date of birth is required' }}
              render={({ field }) => (
              <DatePicker
                {...field}
                className="w-full h-10"
                placeholder="Select Date"
                onChange={(value) => field.onChange(value)} 
                value={field.value ? new Date(field.value) : null}
                format="yyyy-MM-dd"
                appearance="default"
                cleanable={true}
                shouldDisableDate={(date?: Date) => {
                  const maxDate = new Date();
                  if (!date) return false;
                  return date > calculateMinDate() || date > maxDate;
                }}
              />
             )}
          />
          {errors.dob && (
            <p className='text-red-600 text-sm py-1'>
              {errors.dob.message}
            </p>
          )}
          </div>
          <div>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Gender</label>
            <select 
              className="select w-full bg-gray-200 select-bordered"
              {...register('gender', { required: 'Gender is required' })}
            >
              <option disabled value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
          </select>
          {errors.gender && (
            <p className='text-red-600 text-sm py-1'>
              {errors.gender.message}
            </p>
          )}
          </div>
          <div>
          
          </div>
        <div className='flex w-full justify-end mt-2'>
          <Button
            text={loading ? null : 'Submit'}
            type="submit"
            classNameText='text-white font-bold'
            className='w-1/3 h-10 rounded-lg bg-black right'
            disabled={loading}
            iconLoading={loading}
          />
        </div>
      </form>
    </div>
  )
}

export default withAuth(information);