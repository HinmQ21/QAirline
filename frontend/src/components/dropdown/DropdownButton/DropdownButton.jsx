import React from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import '../../../css/dropdown/DropdownButton.css'

const DropdownButton = ({children, isOpen, toggle}) => {
  return (
    <div className={`dropdown-btn ${isOpen ? 'button-open' : null}`}  
        onClick={toggle}
    >
        {children} 
        <span className="toggle-icon">{isOpen ? <FaChevronDown /> : <FaChevronUp />}</span>
    </div>
  )
}

export default DropdownButton