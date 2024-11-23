import React, {forwardRef, memo } from 'react'
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
  value,
  onClick,
  ...rest
} : InputProps, ref) => {

  return (
    <label className={`input flex items-center gap-2 bg-search ${className}`}>
        {icon && <Image src={icon} alt={icon} width={width} height={height} />}
        <input
          ref={ref}
          type={type}
          className={`${styles.input} ${styles.plaintext} bg-search w-full h-full text-textColor ${classInput}`}
          placeholder={placeholder}
          value={value}
          {...rest}
        />
        {iconComponent && <div onClick={onClick}>{iconComponent}</div>}
    </label>
  )
})

export default memo(Input)