'use client'

import React, { useState } from 'react'
import { RiUserSettingsLine } from "react-icons/ri";
import {Avatar, Button, Modal} from '@/components'
import { MdCake } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { UserState } from '@/types';
import useGetFollow from '@/api/follow/getFollow';

interface MiniProfileProps {
    hide?: boolean,
    user: UserState,
}

const MiniProfile = ({hide, user}: MiniProfileProps) => {

  const fullName = `${user.firstName} ${user.lastName}`

  const {loading, getFollow, follows} = useGetFollow()

  const [openFollow, setOpenFollow] = useState<string>('')

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
        value: user.dob
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

  const handleOpenModal= async(type: string) => {
    if(type === 'Followers') {
        setOpenFollow('Followers')
        if(user.id){
            await getFollow('followers', user.id)
        }
    }
    else if(type === 'Followings') {
        setOpenFollow('Followings')
        if(user.id){
            await getFollow('followings', user.id)
        }
    }
  }

  const handleCloseModal = ()=> {
    setOpenFollow('')
  }

  return (
    <div className='card w-full'>
        {!hide && <div className='flex gap-3 items-center'>
            <a href={`/${user.username}`} className='flex items-center'>
                <Avatar
                    width={10}
                    id={user.id}
                    height={10}
                    alt={user.avatar ?? ''}
                    className='w-[52px] h-[52px]'
                    src={user.avatar ?? ''}
                />
            </a>
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
        </div>}

        {!hide && <div className='divider w-full mx-0 my-2' />}

        <div className='flex w-full justify-around'>
            {profile.map((item, index)=> (
                <div key={index} className='flex flex-col items-center cursor-pointer' onClick={()=>handleOpenModal(item.title)}>
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

        {openFollow !== '' && <Modal 
            title={<div className='w-full text-textColor text-center font-bold text-xl py-2'>{openFollow}</div>}
            onClose={handleCloseModal}
            closeIcon
            className='bg-navbar'
            children={
                follows && follows.map((follow)=> (
                    <div className='flex gap-2 items-start' key={follow.id}>
                    <a href={`/${follow.userName}`}> <Avatar width={1} id={follow.id} height={1} src={follow.avatar ?? undefined} alt='avatar' className='w-[42px] h-[42px]'/></a>
                    <div className='flex flex-col cursor-pointer'>
                        <a href={`/${follow.userName}`} className='font-bold hover:underline text-textColor'>{follow.fullName}</a>
                        <span className='text-textColor text-sm'>{follow.isFollowing}</span>
                    </div>

                </div>
                ))
            }
        />}

    </div>
  )
}

export default MiniProfile