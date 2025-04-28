import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

import "../../../css/dropdown/Dropdown.css";


export const Dropdown = ({buttonText, content}) => {
    const [isOpen, setOpen] = useState(false);
    const toggleDropdown = () => {
        setOpen(!isOpen);
    }
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        setOpen(false);
    }, [buttonText])
    return (
        <div className="dropdown" ref={dropdownRef}>
            <DropdownButton isOpen={isOpen} toggle={toggleDropdown}>
                {buttonText}
            </DropdownButton>
            <DropdownContent isOpen={isOpen} toggle={toggleDropdown}>
                {content}
            </DropdownContent>
        </div>
    )
}

export const DropdownButton = ({children, isOpen, toggle}) => {
  return (
    <div className={`dropdown-btn ${isOpen ? 'button-open' : null}`}  
        onClick={toggle}
    >
        {children} 
        <span className="toggle-icon">{isOpen ? <FaChevronDown /> : <FaChevronUp />}</span>
    </div>
  )
}

export const DropdownContent = ({children, isOpen, toggle}) => {
  return (
    <div className={`dropdown-content ${isOpen ? 'content-open' : null}`}>
        {children}
    </div>
  )
}

export const DropdownItem = ({children, onClick}) => {
  return (
    <div className='dropdown-item' onClick={onClick}>
        {children}
    </div>
  )
}