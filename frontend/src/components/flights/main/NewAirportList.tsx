// New AirportList component
// Try to fetch API only once when the component is mounted and save data to paren component
// Fetch va show duoc ra truoc da
// B1: xong - fetch API 1 lan
// B2: fetch data
import { 
  useEffect, 
  useState, 
  useRef
} from "react";

import { clientApi } from "@/services/client/main";
import { GetAirportRequest } from "@/services/schemes/airport";

import { IoMdClose } from "react-icons/io";

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

//make it only fetch api from first click


export const NewAirportList = ({ data, setData, value, setValue, setOpen }: any) => {
  const code = "";
  const name = "";
  const city = "";
  const country = "";

  const getAirportList = async () => {
    try { 
      const res = await clientApi.getAirportList({code, name, city, country});
      if (res) {
        console.log("Airport list fetched successfully:", res);
        //----temp comment --------
        setData(res);
      }

    } catch (err) {
      console.error("Error fetching airport list:", err);
    }

  };

  //call api first time when mount
  useEffect(() => {
    if (data == null) getAirportList();
  }, []);

  return (
  <>
    
        {data == null ? (
          <CommandEmpty>Data is Loading</CommandEmpty>
        ) : (
          <CommandList>
            <CommandEmpty>No Airport found.</CommandEmpty>
            <CommandGroup>
              {data.map((airport: any) => (
                <CommandItem
                  key={airport.code}
                  value={airport.code}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  className={cn("flex rounded-xl justify-between items-center p-3 hover:bg-red-300")}
                >
                  {
                    <>
                      <div>
                        <div className="text-[14px] inter-medium">{airport.city}</div>
                        <div className="text-[14px] text-gray-500 inter-medium">{airport.name}</div>
                      </div>

                      <div className="w-16 h-8 bg-red-800 rounded-lg flex justify-center items-center inter-bold text-white">
                        {airport.code}
                      </div>
                    </>
                  }
                  <Check
                    className={cn(
                      "ml-auto",
                      value === airport.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}      </CommandGroup>
          </CommandList>
        )}
      
  </>
  );
}