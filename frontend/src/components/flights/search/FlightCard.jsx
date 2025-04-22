import React from 'react'
import { LuAArrowDown } from 'react-icons/lu'


export const FlightCard = ({children, flight}) => {
  return (
    <div className="m-4 w-full h-50 bg-white rounded-lg shadow-xl border-t-2 border-t-gray-300
                    flex items-center ">
      {/* FlightInfo */}
      <div className="m-2 w-3/5 h-full
                      flex items-center">
        {/* FlightOverview */}
        <div className="ml-2 mr-6 w-1/2 h-1/2 border-r-1 border-r-gray-300
                        flex flex-col pr-6 py-2"> 
          <div className="flex justify-between items-center">
            <div className='flex flex-col'>
              <p>{flight.depatureTime}</p>
              <p>HAN</p>
            </div>
            <p>..................................................</p>
            <div className='flex flex-col'>
              <p>{flight.arrivalTime}</p>
              <p>SGN</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3">
            <p>Nha ga 1</p>
            <p>Nha ga 1</p>
          </div>
        </div>
        {/* FlightDetails */}
        <div className="ml-2 w-2/5 h-1/2 
                        pt-2 flex flex-col justify-center">
          <div className="flex m-1">
            <LuAArrowDown className="w-6 h-6 m-1" />
            <p>{`Thoi gian bay 8h10`}</p>
          </div>

          <div className="flex m-1">
            <LuAArrowDown className="w-6 h-6 m-1" />
            <p>{`${flight.aircraft} duoc QAirline khai thac`}</p>
          </div>
          <div className="flex m-1">
            <div className='w-6 h-6 m-1'></div>
            <p className='text-red-600 underline m-1
                          hover:text-red-700 cursor-pointer'>
              Xem chi tiet tren hanh trinh
            </p>
            
          </div>
        </div>
      </div>         
    </div>
  )
}
