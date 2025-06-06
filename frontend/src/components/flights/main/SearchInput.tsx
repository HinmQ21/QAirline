import {
  useState
} from "react";

import { AirportList } from "./AirportList"

import { IoMdClose } from "react-icons/io";
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

export const SearchInput 
= ({data, setData, placeholder, Icon, value, setValue, layout} : any) => {
  
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className={`${layout} `}>
            {Icon && <Icon size={40} className="opacity-50" />}
            {value ? data.find((airport: any) => airport.code === value.slice(0, 3))?.city
                   : placeholder}           
          </Button>          
        </PopoverTrigger>

        <PopoverContent className="w-100 h-90 pl-1 pr-3 pt-3" align="start">
          
          {/* <IoMdClose className="absolute top-3 right-3 z-10"/> */}
          <Command>
            <CommandInput placeholder="Search ..." className="" />
              <AirportList data={data} setData={setData} value={value} 
                           setValue={setValue} setOpen={setOpen} />
          </Command> 

        </PopoverContent>
      </Popover> 
    </>
  );
}