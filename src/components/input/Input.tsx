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
  onFocus,
  ...rest
} : InputProps, ref) => {

  return (
    <label className={`input flex items-center gap-2 ${className}`}>
        {icon && <Image src={icon} alt={icon} className='text-textColor' width={width} height={height} />}
        <input
          ref={ref}
          type={type}
          className={`${styles.input} ${styles.plaintext} bg-search w-full h-full ${classInput}`}
          placeholder={placeholder}
          value={value}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          {...rest}
        />
        {iconComponent && <div className='text-textColor' onClick={onClick}>{React.createElement(iconComponent)}</div>}
    </label>
  )
})

Input.displayName = 'Input';

export default memo(Input)