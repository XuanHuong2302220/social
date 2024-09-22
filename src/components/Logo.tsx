import Image from 'next/image'
import React from 'react'
import logo from '@/assets/images/logo.svg'

const Logo = () => {
  return (
    <div className='flex items-center'>
        <Image src={logo} width={40} height={40} alt='logo' />
        <h1 className='font-bold text-4xl text-primaryColor'>TalkTown</h1>
    </div>
  )
}

export default Logo