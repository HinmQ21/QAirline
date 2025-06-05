
import React from 'react';
import { 
  useState,
} from "react";

import { SearchInput } from "./SearchInput"


import { LuPlaneTakeoff } from "react-icons/lu";
import { LuPlaneLanding } from "react-icons/lu";
import { ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SearchInputLayout =   `m-2 w-80 h-14 
                            border-3 rounded bg-gray-100 shadow-none 
                            p-2 flex flex-row items-center justify-start gap-2
                            text-black inter-medium text-base`;

export const SearchFlight 
= ({startAirport, setStartAirport, endAirport, setEndAirport, maxPrice, setMaxPrice}) => {
  const [airPortList, setAirportList] = useState(null);
  
  const handleSearch = () => {

  }
  return (
    <>
      <div className="m-4 mb-8 flex flex-wrap justify-center items-center w-full ">
        <SearchInput
          data={airPortList}
          setData={setAirportList}
          placeholder="From"
          Icon={LuPlaneTakeoff}
          value={startAirport}
          setValue={setStartAirport}
          layout={SearchInputLayout}
          
        />

        <SearchInput
          data={airPortList}
          setData={setAirportList}
          placeholder="To"
          Icon={LuPlaneLanding}
          value={endAirport}
          setValue={setEndAirport}
          layout= {SearchInputLayout}              
        /> 

        <Input type="text" placeholder='Toi da' className={SearchInputLayout} 
        value={maxPrice} onChange={e => setMaxPrice(e.target.value)}/>
        <Button type="submit" className="w-30 h-10" onClick={handleSearch}>Tim kiem</Button>
      </div>
    </>
  );
}