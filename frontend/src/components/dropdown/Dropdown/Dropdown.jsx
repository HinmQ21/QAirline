import React from 'react'
import { useState, useEffect, useRef } from 'react';
import DropdownButton from '../DropdownButton/DropdownButton'
import DropdownContent from '../DropdownContent/DropdownContent'

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
