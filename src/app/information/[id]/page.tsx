'use client'

import withAuth from '@/middleware/withAuth'
import { selectUser } from '@/redux/features/user/userSlice'
import { useAppSelector } from '@/redux/hooks'
import React from 'react'

const information = () => {

  const user = useAppSelector(selectUser)
  console.log(user)

  return (
    <div>information</div>
  )
}

export default withAuth(information)