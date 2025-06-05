

import { 
  useEffect, 
  useState, 
  useRef
} from "react";

import { clientApi } from "@/services/client/main";
import { GetAirportRequest } from "@/services/schemes/airport";

import { IoMdClose } from "react-icons/io";


//make it only fetch api from first click
type GetAirportListProps = {
  data: GetAirportRequest[] | null;
  setData: (data: GetAirportRequest[]) => void;
  setInputValue: (city: string) => void;
}


export const AirportList = ({ data, setData, setInputValue }: GetAirportListProps) => {
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
    <div className="w-[400px] h-[250px] pl-1 pr-3 pt-3">
        {/* Header + Tabs */}
        <IoMdClose className="absolute top-3 right-3 z-10"/>
        {data == null ? (
          <div className="flex flex-row items-center justify-center h-full">
            <p className="inter-bold text-red-800 text-2xl">Dang tai...</p>
          </div>
        ) : (
            
              data.map((airport) => (
              <div key={airport.code} onClick={() => {setInputValue(airport.city)}}
              className="flex rounded-xl justify-between items-center p-3 hover:bg-red-300"
              >
                <div>
                  <div className="text-[14px] inter-medium">{airport.city}</div>
                  <div className="text-[14px] text-gray-500 inter-medium">{airport.name}</div>
                </div>

                <div className="w-16 h-8 bg-red-800 rounded-lg flex justify-center items-center inter-bold text-white">
                  {airport.code}
                </div>
              </div>
              ))
            
            
        )}
    </div>

  );
}