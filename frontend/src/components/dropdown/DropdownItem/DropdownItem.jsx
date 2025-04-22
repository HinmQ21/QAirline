import React from 'react'
import "../../../css/dropdown/DropdownItem.css";

export const DropdownItem = ({children, onClick}) => {
  return (
    <div className='dropdown-item' onClick={onClick}>
        {children}
    </div>
  )
}
