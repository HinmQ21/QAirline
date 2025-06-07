import React from 'react'
import { LuAArrowDown } from 'react-icons/lu'
import { PriceCard } from './PriceCard'
import { useState } from 'react'


export const FlightCard = ({children, flight, OnToggle}) => {
  
  const [serviceType, setServiceType] = useState("eco");
  const [priceService, setPriceService] = useState(false);
  const handlePriceClick = (type) => {
    setPriceService(!priceService);
    setServiceType(type);
    OnToggle();
  }
  return (
    <>
      {/* FlightCard */}
      <div className="w-full h-50 bg-white rounded-4xl shadow-xl border-t-gray-300
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
              <p>Nhà ga 1</p>
              <p>Nhà ga 1</p>
            </div>
          </div>
          {/* FlightDetails */}
          <div className="ml-2 w-2/5 h-1/2 
                          pt-2 flex flex-col justify-center">
            <div className="flex m-1">
              <LuAArrowDown className="w-6 h-6 m-1" />
              <p>{`Thời gian bay 8h10`}</p>
            </div>

            <div className="flex m-1">
              <LuAArrowDown className="w-6 h-6 m-1" />
              <p>{`${flight.aircraft} được QAirline khai thác`}</p>
            </div>
            <div className="flex m-1">
              <div className='w-6 h-6 m-1'></div>
              <p className='text-red-600 underline m-1
                            hover:text-red-700 cursor-pointer'>
                Xem chi tiết hành trình
              </p>            
            </div>
          </div>        
        </div>
        {/* FlightPrice */}
        <div className="w-2/5 h-full flex justify-end items-center">
          <PriceCard 
            type={"Phổ thông"} 
            slot={flight.slot.eco} 
            booked={flight.booked.eco} 
            price={flight.price.eco} 
            roundstyle={false}
            onClick={() => handlePriceClick("eco")}
            selected={priceService}
          />        
          <PriceCard 
            type={"Thương gia"} 
            slot={flight.slot.business} 
            booked={flight.booked.business} 
            price={flight.price.business} 
            roundstyle={true} 
            onClick={() => handlePriceClick("business")}
            selected={priceService}
          />        
        </div>
      </div>
      {/* SelectedFlightCard */}
      {priceService && (
        <div className="ml-4 py-4 w-full h-fit h-max-100 bg-gray-100 rounded-lg shadow-xl 
                        flex items-center justify-center">
          <div className={`m-2 w-3/10 h-9/10  bg-white rounded-lg shadow-lg
                          flex flex-col justify-center items-start
                          hover:border-4
                          ${serviceType == "Phổ thông" ? "border-amber-950" : "border-red-700"}  
                        `}> 
            {serviceType == "Phổ thông" && (
              <>
                {/* Header */}
                <div className="h-20 w-full mb-0.5
                                rounded-t-lg rounded-b-full shadow-xl
                                flex justify-center items-center
                                "
                                
                >
                  <p className='text-2xl font-bold text-amber-950 '>{`${new Intl.NumberFormat('vi-VN').format(flight.price.eco)} VND`}</p>         
                </div>
                {/* Details  */}
                <div className="h-60 w-full py-4
                                flex flex-col justify-evenly items-start gap-2">
                  <p className="ml-4">Hành lý xách tay: 7kg</p>
                  <p className="ml-4">01 kiện hành lý ký gửi 20kg</p>
                  <p className="ml-4">Hoàn/hủy trước giờ khởi hành: 450.000 VND</p>
                  <p className="ml-4">Chọn ghế ngồi mất phí</p>
                </div>

                {/* ViewMore  */}
                <div className="h-20 w-full py-4 px-4">
                  <p className="underline text-amber-950" onClick={() => {}}>(*) Xem chi tiết</p>
                </div>
              </>
            )}
            {serviceType == "Thương gia" && (
              <>
                {/* Header */}
                <div className="h-20 w-full
                                rounded-t-lg rounded-b-full shadow-xl
                                flex justify-center items-center
                                "
                                
                >
                  <p className='text-2xl font-bold text-red-700 '>{`${new Intl.NumberFormat('vi-VN').format(flight.price.business)} VND`}</p>         
                </div>
                {/* Details  */}
                <div className="h-60 w-full py-4
                                flex flex-col justify-evenly items-start gap-2">
                  <p className="ml-4">Hành lý xách tay: 10kg</p>
                  <p className="ml-4">01 kiện hành lý ký gửi 30kg</p>
                  <p className="ml-4">Hoàn/hủy trước giờ khởi hành: 350.000 VND</p>
                  <p className="ml-4">Chọn ghế ngồi KHÔNG mất phí</p>
                </div>
                
                {/* ViewMore  */}
                <div className="h-20 w-full py-4 px-4">
                  <p className="underline text-red-600" onClick={() => {}}>(*) Xem chi tiết</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
