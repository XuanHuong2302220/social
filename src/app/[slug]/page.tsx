'use client'
import { selectUser } from '@/redux/features/user/userSlice'
import { useAppSelector } from '@/redux/hooks'
import React from 'react'

const Profile = () => {

  const user = useAppSelector(selectUser)

  return (
    <div>{user.username}'s profile</div>
  )
}

export default Profile