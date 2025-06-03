//User click in the airport
// Render a list of airports
// call api here

import { 
  useEffect, 
  useState, 
  useRef 
} from "react";


//make it only fetch api from first click


export const AirportList = ({ data, setData }) => {
  useEffect(() => {
    if (data == null) { 
      // Chỉ fetch lần đầu khi menu thực sự mở và chưa fetch
      console.log("Fetch api one time only");
      setData([1, 2,])
      // Gọi API ở đây
    } else return;
  }, []);

  return (
    <div className="flex w-12 h-40 bg-white items-center justify-center absolute top-1 left-1">
      <p>Airport</p>
    </div>
  );
}