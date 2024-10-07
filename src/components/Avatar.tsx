import { AvatarProps } from '@/types'
import React from 'react'
import avatar from '@/assets/icons/avatar.svg'
import Image from 'next/image'

const Avatar = ({width, src, alt, className, height}: AvatarProps) => {
  return (
    <div className={`avatar `}>
        <div className='w-15 ${className} h-15 rounded-full'>
            <Image className='rounded-full' src={src ? src : avatar} width={width} height={height} alt={alt} />
        </div>
    </div>
  )
}

export default Avatar