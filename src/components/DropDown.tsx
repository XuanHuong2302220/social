import React from 'react'
import { DropDownProps } from '@/types/index'

const DropDown = ({className, classNameContent, parents, children, tabIndex, position}: DropDownProps) => {

  return (
    <div className={`dropdown dropdown-${position}`} >
        <div tabIndex={tabIndex} className={className}>{parents}</div>
          {children && 
          <div tabIndex={tabIndex} className={`dropdown-content shadow ${classNameContent}`}>
           {children}
          </div>}
    </div>
    
  )
}

export default DropDown