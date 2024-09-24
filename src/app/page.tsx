'use client'

import React from 'react'
import withAuth from '@/middleware/withAuth'

const Home = () => {
  const token = localStorage.getItem('token')
  console.log('token', token)
  return (
    <div>Home</div>
  )
}

export default withAuth(Home)