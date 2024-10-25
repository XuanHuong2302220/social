import React, { forwardRef } from 'react'
import Image from 'next/image'
import { ButtonProps } from '@/types'
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({text, icon, onClick, onMouseEnter, onMouseLeave, className, width, height, classNameText, type, disabled, iconLoading, right, left} : ButtonProps, ref) => {
  return (
    <button ref={ref} disabled={disabled} className={`btn flex items-center ${className}`} onClick={onClick} onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter} type={type} >
        {icon && !right && !left && <Image src={icon} alt={icon} width={width} height={height} />}
        {left && icon}
       {text && <span className={`${classNameText}`}>{text}</span>}
        {right && icon}
        {iconLoading && <span className="loading loading-dots loading-md"></span>}
    </button>
  )
})

export default Button