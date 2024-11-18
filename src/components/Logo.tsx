import Image from 'next/image'
import React from 'react'
import logo from '@/assets/images/logo.svg'
import { logoProps } from '@/types'

const Logo = ({isLogo, width, size, onClick} : logoProps) => {
  return (
    <div className='flex items-center cursor-pointer no-underline hover:no-underline' onClick={onClick}>
        <Image src={logo} width={width ? width : 40} height={width ? width : 40} alt='logo' />
        {isLogo ? null : <h1 className={`font-bold text-primaryColor hover:no-underline ${size ? size : 'text-4xl'}`}>TalkTown</h1>}
    </div>
  )
}

export default Logo