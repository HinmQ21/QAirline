// New AirportList component
// Try to fetch API only once when the component is mounted and save data to paren component
// Fetch va show duoc ra truoc da
// B1: xong - fetch API 1 lan
// B2: fetch data - oke
//B3: Tinh nang query - oke
//B4: Chon Airport - hien thi ra ngoai parrent cha
//B5: Xoa may cai xau  va thua di

import { 
  useEffect, 
  useState, 
  useRef
} from "react";

import { clientApi } from "@/services/client/main";
import { GetAirportRequest } from "@/services/schemes/airport";

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"


//make it only fetch api from first click
type GetAirportListProps = {
  data: GetAirportRequest[] | null;
  setData: (data: GetAirportRequest[]) => void;
  setInputValue: (city: string) => void;
}

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
          <CommandEmpty className={cn("flex flex-row items-center justify-center h-full inter-bold text-red-800 text-2xl")}>
            Data is Loading
          </CommandEmpty>
        ) : (
          <CommandList>
            <CommandEmpty>No Airport found.</CommandEmpty>
            <CommandGroup >
              {data.map((airport: any) => (
                <CommandItem
                  key={airport.code}
                  value={`${airport.code} ${airport.name} ${airport.city}`}  
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}    
                  className={cn("")}
                > 
                  
                    <div className=" flex-1 flex rounded-xl justify-between items-center p-3">
                      <div>
                        <div className="text-[14px] inter-medium">{airport.city}</div>
                        <div className="text-[14px] text-gray-500 inter-medium">{airport.name}</div>
                      </div>

                      <div className="w-16 h-8 bg-red-800 rounded-lg flex justify-center items-center inter-bold text-white">
                        {airport.code}
                      </div>
                    </div>
                  
                  <Check
                    className={cn(
                      "ml-auto",
                      value.slice(0, 3) == airport.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}      
            </CommandGroup>
          </CommandList>
        )}     
  </>
  );
}