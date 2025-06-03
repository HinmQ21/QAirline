//Textinput co controller track lai value


import React from 'react';
import { 
  useState,
  useEffect,
} from "react";

import { AirportList } from './AirportList';

import { LuPlaneTakeoff } from "react-icons/lu";
import { LuPlaneLanding } from "react-icons/lu";
import { FaFilterCircleDollar } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"



export const SearchFlight = () => {

  const [query, setQuery] = useState({ from: "", to: "" });
  const [toggleAirportList, setToggleAirportList] = useState(false);
  const [startAirportStatus, setStartAirportStatus] = useState(false);
  const [endAirportStatus, setEndAirportStatus] = useState(false);
  const [data, setData] = useState(null);


  const handleToggleStartAirportList = () => {
    setStartAirportStatus(prev => !prev);
    setEndAirportStatus(false);

  }
  const handleToggleEndAirportList = () => {
    setEndAirportStatus(prev => !prev);
    setStartAirportStatus(false);
  }
  const handleSearch = () => {
    const matched = flightsMock.filter(
      f => f.from.includes(query.from) && f.to.includes(query.to)
    );
    setResults(matched);
  };
  const flightsearchInput = (placeholder, value, onChange, Icon, isStartDes) => {
    return (
      <div className="relative" >
        <div className="flex flex-row border border-gray-300 rounded p-2 m-2 bg-white w-80">
          {Icon && <Icon className="w-5 h-5 text-gray-500 mr-2" />}
          <input
            type="text"
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="flex-1 bg-transparent outline-none text-gray-700 w-full"
            onClick={() => {
              if (isStartDes) {
                handleToggleStartAirportList();
              } else {
                handleToggleEndAirportList();
              }
            }}
          />
        </div>

        {isStartDes && startAirportStatus && <AirportList />}
        {!isStartDes && endAirportStatus && <AirportList />}
      </div>
    );
  };


  const newSearchInput = () => {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <p>a</p>
          </DropdownMenuTrigger>
          <DropdownMenuContent >
            <AirportList
            data={data}   
            setData = {setData}
          />
          </DropdownMenuContent>
          
        </DropdownMenu>
      </>
    );
  }

  return (
    <>
      <div className="m-4 mb-8 flex flex-wrap justify-center items-center w-full">
        {flightsearchInput(
          "Start Destination",
          query.from,
          (e) => setQuery({ ...query, from: e.target.value }),
          LuPlaneTakeoff, // Pass the icon component
          true,
        )}
        {flightsearchInput(
          "End Destination",
          query.to,
          (e) => setQuery({ ...query, to: e.target.value }),
          LuPlaneLanding,
          false,
        )}
        {/* {flightsearchInput(
          "Maximum Price",
          query.to,
          (e) => setQuery({ ...query, to: e.target.value }),
          FaFilterCircleDollar,
      
        )} */}


        {newSearchInput()}
      </div>
    </>
  );
}