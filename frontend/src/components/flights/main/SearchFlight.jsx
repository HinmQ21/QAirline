//Textinput co controller track lai value
//Viet cai nay lai thanh component tot hon dung duoc ca cho trang khac
//hoan thien giao dien newSearch
//them tinh nang querry cho new Search: Nhap ten vao co the tim kiem duoc
// dau tien la tim theo ten san bay, neu co hien thi, neu khong co tim theo ten thanh pho, neu khong co tim theo tne quoc gia
// neu van khong thay thi ko hien

//Muc tieu la chay duoc va nhanh nhat co the
//B1: Co the nhap vao trong nay
//An lai vao thi bi dong mat cua so => Do thu vien Dropdown Cai dat
// Dung thu vien khac, phuong an thiet ke khac, tu custom
// Sua sang thu vien SelectFramWork




import React from 'react';
import { 
  useState,
  useEffect,
} from "react";

import { AirportList } from './AirportList';

import { LuPlaneTakeoff } from "react-icons/lu";
import { LuPlaneLanding } from "react-icons/lu";
import { FaFilterCircleDollar } from "react-icons/fa6";

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

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]



export const SearchFlight = () => {

  const [query, setQuery] = useState({ from: "", to: "" });
  const [toggleAirportList, setToggleAirportList] = useState(false);
  const [startAirportStatus, setStartAirportStatus] = useState(false);
  const [endAirportStatus, setEndAirportStatus] = useState(false);
  const [data, setData] = useState(null);
  const [cityStart, setCityStart] = useState("");
  const [inputValue, setInputValue] = useState("");

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  


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

  const styleSearchBar = "m-2 w-80 border border-gray-300 rounded bg-white p-2 flex flex-row"

  const newSearchInput = (styleName, placeholder, inputValue) => {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className={`${styleName}`}>
              <input 
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <AirportList
              data={data}   
              setData = {setData}
              setInputValue={setInputValue}
            />
          </DropdownMenuContent>
          
        </DropdownMenu>
      </>
    );
  }

  const newNewSearchInput = () => {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? frameworks.find((framework) => framework.value === value)?.label
              : "Select framework..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {framework.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover> 
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


        {newSearchInput(styleSearchBar, "Start Destination", inputValue)}

        {newNewSearchInput()}
      </div>
    </>
  );
}