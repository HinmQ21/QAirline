import React from 'react'
import { LuAArrowDown } from 'react-icons/lu'
import { PriceCard } from './PriceCard'
import { useState } from 'react'


export const FlightCard = ({children, flight}) => {
  const [priceService, setPriceService] = useState(false);
  const [serviceType, setServiceType] = useState("eco");
  const handlePriceClick = (type) => {
    setPriceService(!priceService);
    setServiceType(type);
  }
  return (
    <>
      {/* FlightCard */}
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
        {/* FlightPrice */}
        <div className="w-2/5 h-full flex justify-end items-center">
          <PriceCard 
            type={"eco"} 
            slot={flight.slot.eco} 
            booked={flight.booked.eco} 
            price={flight.price.eco} 
            roundstyle={false}
            onClick={() => handlePriceClick("eco")}
          />        
          <PriceCard 
            type={"business"} 
            slot={flight.slot.business} 
            booked={flight.booked.business} 
            price={flight.price.business} 
            roundstyle={true} 
            onClick={() => handlePriceClick("business")}
          />        
        </div>
      </div>
      {/* SelectedFlightCard */}
      {priceService && (
        <div className="ml-4 py-4 w-full h-fit h-max-100 bg-gray-100 rounded-lg shadow-xl 
                        flex items-center justify-center">
          <div className="m-2 w-2/5 h-9/10  bg-white rounded-lg shadow-lg
                          flex flex-col justify-center items-start
                          hover:border-red-700 hover:border-4
                          
                         "
          >
            {serviceType == "eco" && (
              <>
                {/* Header */}
                <div className="h-20 w-full
                                rounded-t-lg rounded-b-full shadow-xl
                                
                                "
                                
                >
                  <p >{flight.price.eco}</p>         
                </div>
                {/* Details  */}
                <p className="ml-4 my-2 px-2 py-2">Hành lý xách tay: 7kg</p>
                <p className="ml-4 my-2 px-2 py-2">01 kiện hành lý ký gửi 20kg</p>
                <p className="ml-4 my-2 px-2 py-2">Hoàn/huỷ trước giờ khởi hành: 450.000 VND</p>
                <p className="ml-4 my-2 px-2 py-2">Chọn ghế ngồi mất phí</p>
              </>
            )}
            {serviceType == "business" && (
              <>
                {/* Header */}
                {/* Details  */}
                <p className="ml-4 my-2 px-2 py-2">Hành lý xách tay: 7kg</p>
                <p className="ml-4 my-2 px-2 py-2">01 kiện hành lý ký gửi 20kg</p>
                <p className="ml-4 my-2 px-2 py-2">Hoàn/huỷ trước giờ khởi hành: 300.000 VND</p>
                <p className="ml-4 my-2 px-2 py-2">Thay đổi miễn phí</p>
                <p className="ml-4 my-2 px-2 py-2">Chọn ghế ngồi miễn phí</p>
            
                
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
