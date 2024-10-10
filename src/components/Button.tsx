import React from 'react'
import Image from 'next/image'
import { ButtonProps } from '@/types'
const Button = ({text, icon, onClick, className, width, height, classNameText, type, disabled, iconLoading, right, left} : ButtonProps) => {
  return (
    <button disabled={disabled} className={`btn flex items-center ${className}`} onClick={onClick} type={type} >
        {icon && !right && !left && <Image src={icon} alt={icon} width={width} height={height} />}
        {left && icon}
        <span className={`${classNameText}`}>{text}</span>
        {right && icon}
        {iconLoading && <span className="loading loading-dots loading-md"></span>}
    </button>
  )
}

export default Button