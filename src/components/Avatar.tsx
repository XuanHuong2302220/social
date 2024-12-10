import { AvatarProps } from '@/types'
import React from 'react'
import avatar from '@/assets/icons/avatar.svg'
import { useAppSelector } from '@/redux/hooks'

const Avatar = ({width, src, alt, className, height, id, onClick}: AvatarProps) => {

  const userOnline = useAppSelector(state => state.socket.userOnline) || [];
  console.log(userOnline)

  return (
    <div className={`avatar ${id && userOnline && userOnline?.some(user => user.id === id) ? 'online' : ''} `}>
        <div className={`${className} rounded-full ${onClick ? 'hover:opacity-50 cursor-pointer ' : ''}`} onClick={onClick}>
          <img className='rounded-full' src={src ? src : avatar.src} width={width} height={height} alt={alt} />
        </div>
    </div>
  )
}

export default Avatar