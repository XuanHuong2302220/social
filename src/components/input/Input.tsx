import React, {forwardRef } from 'react'
import { InputProps } from '@/types'
import Image from 'next/image'
import styles from './input.module.css'
const Input = forwardRef<HTMLInputElement, InputProps>(({
  placeholder,
  type,
  icon,
  width,
  height,
  className,
  iconComponent,
  classInput,
  onClick,
  ...rest
} : InputProps, ref) => {

  return (
    <label className={`input flex items-center gap-2 bg-colorInput ${className}`}>
        {icon && <Image src={icon} alt={icon} width={width} height={height} />}
        <input
          ref={ref}
          type={type}
          className={`${styles.input} ${styles.plaintext} bg-colorInput w-full h-full text-black bg-inherit ${classInput}`}
          placeholder={placeholder}
          {...rest}
        />
        {iconComponent && <div onClick={onClick}>{iconComponent}</div>}
    </label>
  )
})

export default Input