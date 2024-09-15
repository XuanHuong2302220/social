import React from 'react'
import { InputProps } from '@/types'
const Input = ({placeholder, type, icon}:InputProps) => {
  return (
    <div>
        {icon && <img src={icon} alt={icon} />}
        <input type={type} className="grow" placeholder={placeholder} />
    </div>
  )
}

export default Input