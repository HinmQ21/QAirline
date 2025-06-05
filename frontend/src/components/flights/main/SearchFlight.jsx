//Muc tieu la chay duoc va nhanh nhat co the

// State cho may bay den va May bay di -> Truyen vao tu parrent --> Xong chuc nang nay roi
// Xoa cai value thua
// Enhance cai view cua no



import React from 'react';
import { 
  useState,
} from "react";

import { SearchInput } from "./SearchInput"

import { LuPlaneTakeoff } from "react-icons/lu";
import { LuPlaneLanding } from "react-icons/lu";
import { ChevronsUpDown } from "lucide-react"

const SearchInputLayout =   `m-2 w-80 h-14 
                            border-3 rounded bg-gray-100 shadow-none 
                            p-2 flex flex-row items-center justify-start gap-2
                            text-black inter-medium text-base`;

export const SearchFlight = ({startAirport, setStartAirport, endAirport, setEndAirport}) => {
  const [data, setData] = useState(null);
  

  return (
    <>
      <div className="m-4 mb-8 flex flex-wrap justify-center items-center w-full ">
        <SearchInput
          data={data}
          setData={setData}
          placeholder="From"
          Icon={LuPlaneTakeoff}
          value={startAirport}
          setValue={setStartAirport}
          layout={SearchInputLayout}
          
        />

        <SearchInput
          data={data}
          setData={setData}
          placeholder="To"
          Icon={LuPlaneLanding}
          value={endAirport}
          setValue={setEndAirport}
          layout= {SearchInputLayout}              
        />        
      </div>
    </>
  );
}