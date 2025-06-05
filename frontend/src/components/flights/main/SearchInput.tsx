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

export const SearchInput = ({data, setData, placeholder, Icon} : any) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="m-2 w-80 border border-gray-300 rounded bg-white p-2 flex flex-row"
          >
            {Icon && <Icon className="" />}
            {value
              ? data.find((airport: any) => airport.code === value.slice(0, 3))?.city
              : placeholder}
           
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] h-[250px] pl-1 pr-3 pt-3">
        <IoMdClose className="absolute top-3 right-3 z-10"/>
        <Command>
        <CommandInput placeholder="Search ..." className="h-9" />
          <AirportList
          data={data}
          setData={setData}
          value={value}
          setValue={setValue}
          setOpen={setOpen}
        />
        </Command>
        </PopoverContent>
      </Popover> 
    </>
  );
}