'use client'

import { Button, Input, Logo, Modal } from '@/components';
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { cleaerUser, selectUser } from '@/redux/features/user/userSlice';
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css'; // Import CSS cho rsuite
import { useParams, useRouter } from 'next/navigation';
import updateUser from '@/api/auth/updateUser';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearToken } from '@/redux/features/auth/authSlice';

interface FormValues {
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'female' | 'male'
}

const information = () => {
  const { register, handleSubmit,control,setValue, formState: { errors } } = useForm<FormValues>();
  const user = useAppSelector(selectUser);
  const {lastName, firstName, username, id} = user;
  const router = useRouter()
  const [loadingLogout, setLoadingLogout] = useState(false)
  const {slug} = useParams()
  const dispatch = useAppDispatch()
  const [isSlugValid, setIsSlugValid] = useState(false)

  const handleLogout =()=> {
    setLoadingLogout(true)
    dispatch(clearToken())
    dispatch(cleaerUser())
    router.push('/login')
  }

  useEffect(()=> {
    if(firstName && lastName){
      setValue('firstName', firstName)
      setValue('lastName', lastName)
      setValue('dob', user.dob ?? '')
      setValue('gender', user.gender as 'female' | 'male')
    }
  }, [])

  useEffect(()=> {
    if(slug !== username){
      router.push('/')
      setIsSlugValid(true)
    }
    else {
      setIsSlugValid(false)
    }
  }, [])

  const calculateMinDate = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
    return minDate;
  };

  const {loading, update} = updateUser();
 
  const onSubmit = async(data: any) => {
    await update(data)
    router.push('/')
  };

  const handleClickLogo = () => {
    if(firstName && lastName){
      router.push('/')
    }
  }

  if(isSlugValid){
    return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
  </div>
  }

  return (
    <div className='bg-gray-100 w-screen h-screen flex justify-center items-center'>
      <form onSubmit={handleSubmit(onSubmit)} className='w-2/4  bg-white rounded-lg shadow-lg p-8 flex flex-col gap-2'>
          <div className='w-full pb-4 flex justify-center' >
            <Logo 
              onClick={handleClickLogo}
            />
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
        <div className='flex w-full justify-between mt-2'>
          <Button
            text='Logout'
            type="submit"
            classNameText='text-white font-bold'
            className='w-1/3 h-10 rounded-lg bg-black right'
            disabled={loading}
            onClick={handleLogout}
          />
          <Button
            text={loading ? null : 'Submit'}
            type="submit"
            classNameText='text-white font-bold'
            className='w-1/3 h-10 rounded-lg bg-primaryColor border-primaryColor hover:bg-primaryColor hover:opacity-50 hover:border-primaryColor right'
            disabled={loading}
            iconLoading={loading}
          />
        </div>

        {loadingLogout && <Modal
          className='w-[200px] h-[200px] flex justify-center items-center'
          children={
            <span className='text-white'>Logging out...</span>
          }
        />}
      </form>
    </div>
  )
}

export default information