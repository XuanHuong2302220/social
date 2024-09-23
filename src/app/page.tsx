'use client'

import React from 'react'
import withAuth from '@/middleware/withAuth'

const Home = () => {
  return (
    <div>Home</div>
  )
}

export default withAuth(Home)