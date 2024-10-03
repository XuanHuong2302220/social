import Image from 'next/image'
import React from 'react'
import logo from '@/assets/images/logo.svg'
import { logoProps } from '@/types'

const Logo = ({isLogo, width, size} : logoProps) => {
  return (
    <div className='flex items-center'>
        <Image src={logo} width={width ? width : 40} height={width ? width : 40} alt='logo' />
        {isLogo ? null : <h1 className={`font-bold  text-primaryColor ${size ? size : 'text-4xl'}`}>TalkTown</h1>}
    </div>
  )
}

export default Logo