'use client'

import React from 'react'
import { RiUserSettingsLine } from "react-icons/ri";
import {Avatar, Button, Modal} from '@/components'
import { useAppSelector } from '@/redux/hooks'
import { selectUser } from '@/redux/features/user/userSlice'
import { MdCake } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { useRouter } from 'next/navigation';


const MiniProfile = () => {

  const user = useAppSelector(selectUser);
  const fullName = `${user.firstName} ${user.lastName}`
  const router = useRouter();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = String(date.getFullYear()) // Lấy 2 chữ số cuối của năm
    return `${day}/${month}/${year}`;
  };

  const profile = [
    {
        title: 'Followers',
        value: user.followers
    },
    {
        title: 'Followings',
        value: user.followings
    },
    {
        title: 'Posts',
        value: user.postCount
    }
  ]

  const information = [
    {
        title: <MdCake />,
        value: user.dob && formatDate(user.dob)
    },
    {
        title: <FaUser />,
        value: user.gender,
        cap: true

    },
    {
        title: <IoIosMail />,
        value: user.email
    }
  ]

  return (
    <div className='card w-full'>
        <div className='flex gap-3 items-center'>
            <Avatar
                width={10}
                height={10}
                alt={user.avatar ?? ''}
                className='w-[52px] h-[52px]'
                src={user.avatar ?? ''}
            />
            <div className='flex flex-col'>
                <span className='text-md text-textColor font-bold'>{fullName}</span>
                <span className='text-sm text-textColor'>@{user.username}</span>
            </div>
            <a href={`/information/${user.username}`} className='underline-offset-0 ml-auto '>
                <Button
                    className='rounded-full text-textColor bg-transparent border-transparent hover:bg-primaryColor hover:text-white'
                    icon={<RiUserSettingsLine />}
                    left
                />
            </a>
        </div>

        <div className='divider w-full mx-0 my-2' />

        <div className='flex w-full justify-around'>
            {profile.map((item, index)=> (
                <div key={index} className='flex flex-col items-center cursor-pointer'>
                    <span className='text-md text-textColor'>{item.value}</span>
                    <span className='text-sm font-bold text-primaryColor'>{item.title}</span>
                </div>
            ))}
        </div>

        <div className='divider w-full mx-0 my-1' />
        
        <div className='flex flex-col px-5'>
            {information.map((item, index)=> (
                <div key={index} className='flex gap-3 py-1 items-center'>
                    <span className='text-lg text-textColor font-bold'>{item.title}</span>
                    <span className={`text-md text-textColor ${item.cap && 'capitalize'}`}>{item.value}</span>
                </div>
            ))}
        </div>

    </div>
  )
}

export default MiniProfile