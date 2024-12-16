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
  onKeyDown,
  ...rest
} : InputProps, ref) => {

  return (
    <label className={`input flex items-center gap-2 ${className}`}>
        {icon && <Image src={icon} alt={icon} className='text-textColor' width={width} height={height} />}
        <input
          ref={ref}
          type={type}
          className={`${styles.input} ${styles.plaintext} bg-search w-full h-full text-textColor ${classInput}`}
          placeholder={placeholder}
          value={value}
          onKeyDown={onKeyDown}
          {...rest}
        />
        {iconComponent && <div onClick={onClick}>{React.createElement(iconComponent)}</div>}
    </label>
  )
})

Input.displayName = 'Input';

export default memo(Input)