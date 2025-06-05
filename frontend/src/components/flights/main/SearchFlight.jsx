//Textinput co controller track lai value
//Viet cai nay lai thanh component tot hon dung duoc ca cho trang khac
//hoan thien giao dien newSearch
//them tinh nang querry cho new Search: Nhap ten vao co the tim kiem duoc
// dau tien la tim theo ten san bay, neu co hien thi, neu khong co tim theo ten thanh pho, neu khong co tim theo tne quoc gia
// neu van khong thay thi ko hien

//Muc tieu la chay duoc va nhanh nhat co the
// Xoa bot - don
// Thay cai search
// search moi cai dat duoc
// Cho phep tuy chinh
// placeholder
// Icon - oke- chuc nang truoc
// vaule nua truyen tu parent cha main page --> (tamthoi)FightSearch --> SearchInput : oke
// string cho phep style: width, height, bgColor, border, borderRadius,
// theme sang hoac toi - cho phep chon

// Truyen vao cac gia tri co the thay doi theo theme duoc
// bg CommandItem
// Text trong commendItem
// Hover cua no -- chua chinh duoc



import React from 'react';
import { 
  useState,
  useEffect,
} from "react";

import { AirportList } from "./AirportList"
import { SearchInput } from "./SearchInput"
import { FlightBooking } from '@/components/home/FlightBooking';

import { LuPlaneTakeoff } from "react-icons/lu";
import { LuPlaneLanding } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandInput,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export const SearchFlight = () => {
  const [query, setQuery] = useState({ from: "", to: "" });
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(""); //tam thoi de value cha o day sau nay cho len parrent
  

  const flightsearchInput = (placeholder, value, onChange, Icon) => {
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
          
          />
        </div>

        
      </div>
    );
  };
  // const SearchInput = () => {
  //   return (
  //     <Popover open={open} onOpenChange={setOpen}>
  //       <PopoverTrigger asChild>
  //         <Button
  //           variant="outline"
  //           role="combobox"
  //           aria-expanded={open}
  //           className="m-2 w-80 border border-gray-300 rounded bg-white p-2 flex flex-row"
  //         >
  //           {value
  //             ? data.find((airport) => airport.code === value.slice(0, 3))?.city
  //             : "Select framework..."}
  //           <ChevronsUpDown className="opacity-50" />
  //         </Button>
  //       </PopoverTrigger>
  //       <PopoverContent className="w-[400px] h-[250px] pl-1 pr-3 pt-3">
  //       <IoMdClose className="absolute top-3 right-3 z-10"/>
  //       <Command>
  //       <CommandInput placeholder="Search ..." className="h-9" />
  //        <AirportList
  //         data={data}
  //         setData={setData}
  //         value={value}
  //         setValue={setValue}
  //         setOpen={setOpen}
  //       />
  //       </Command>
  //   </PopoverContent>
  //     </Popover> 
  //  );
  // }

  return (
    <>
      <div className="m-4 mb-8 flex flex-wrap justify-center items-center w-full ">
        {/* {flightsearchInput(
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
        )} */}
        <SearchInput
          data={data}
          setData={setData}
          placeholder="Start"
          Icon={LuPlaneTakeoff}
          value={value}
          setValue={setValue}
          layout="m-2 w-80 h-10 border border-gray-300 rounded bg-white p-2 flex flex-row"
          
        />

        <SearchInput
          data={data}
          setData={setData}
          placeholder="End"
          Icon={LuPlaneTakeoff}
          value={value}
          setValue={setValue}
          layout="m-2 w-80 h-10 border border-gray-300 rounded p-2 flex flex-row text-black"
        />

        
      </div>
    </>
  );
}