import React from 'react'
import { DropDownProps } from '@/types/index'

const DropDown = ({className, classNameContent, parents, children, tabIndex}: DropDownProps) => {
  return (
    <div className="dropdown" >
        <div tabIndex={tabIndex} className={className}>{parents}</div>
          {children && <ul tabIndex={tabIndex} className={`dropdown-content menu shadow ${classNameContent}`}>
           {children}
        </ul>}
    </div>
    
  )
}

export default DropDown