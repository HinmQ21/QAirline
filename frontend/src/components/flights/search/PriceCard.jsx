import React from 'react'

export const PriceCard = ({type, slot, booked, price, roundstyle, onClick }) => {
  

  return (
    <>    
      <div className={`h-full min-w-50 ml-1 relative
                      flex flex-col justify-center items-center
                      ${roundstyle == true ? "rounded-r-lg" : ""}
                      ${booked >= slot ? "cursor-auto bg-gray-400 " : "cursor-pointer"}
                      ${(type === "eco" && booked < slot) ? "bg-amber-950" : ""}
                      ${(type === "business" && booked < slot) ? "bg-red-600" : ""}
                    `}
            onClick={booked < slot ? onClick : null}
      >
          {(booked >= slot) ? (
            <>
              <p className="text-2xl inter-semibold text-black capitalize ">{type}</p>
              <div className="h-10 w-fit m-2 bg-gray-600 rounded-md ">
                <p className="m-2 text-white">het hang dat cho</p>
              </div>
            </>
          ) : (
            <>
              <p className="text-2xl inter-semibold text-white capitalize ">{type}</p>
              <p className="text-lg inter-regular text-white">from</p>
              <p className="text-2xl inter-semibold text-white ">{new Intl.NumberFormat('vi-VN').format(price)}</p>
              <p className='text-lg inter-regular text-white'>VND</p>

              {(slot-booked < 10 && slot-booked > 0) && (
                <div className="absolute h-6 w-28 top-[-24px]                    
                bg-red-700 rounded-t-sm flex justify-center items-center">
                  <p className="text-[14px] inter-semibold text-white ">{slot - booked} cho con lai</p>
              </div>
              )}
            </>
          )}
          
      </div>     
    </>
  )
}
