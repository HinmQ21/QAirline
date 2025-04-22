import React from 'react'
import "../../../css/dropdown/DropdownContent.css";

const DropdownContent = ({children, isOpen, toggle}) => {
  return (
    <div className={`dropdown-content ${isOpen ? 'content-open' : null}`}>
        {children}
    </div>
  )
}

export default DropdownContent