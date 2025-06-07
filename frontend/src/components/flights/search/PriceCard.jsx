import React from 'react'
import { useState } from 'react'

export const PriceCard = ({type, slot, booked, price, roundstyle, onClick, selected }) => {
  
  return (
    <>
      {!selected && (
        <>
          <div className={`h-full min-w-50 relative
                          flex flex-col justify-center items-center
                          ${roundstyle == true ? "rounded-r-4xl" : ""}
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
                    <p className="m-2 text-white">Hết hạng đặt chỗ</p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-2xl inter-semibold text-white capitalize ">{type}</p>
                  <p className="text-lg inter-regular text-white">từ</p>
                  <p className="text-2xl inter-semibold text-white ">{new Intl.NumberFormat('vi-VN').format(price)}</p>
                  <p className='text-lg inter-regular text-white'>VND</p>

                  {(slot-booked < 10 && slot-booked > 0) && (
                    <div className="absolute h-6 w-28 top-[-24px]                    
                    bg-red-700 rounded-t-sm flex justify-center items-center">
                      <p className="text-[14px] inter-semibold text-white ">{slot - booked} chỗ còn lại</p>
                    </div>
                  )}
                </>
              )}
              
          </div>    
        </>
      )}
      {(selected && type == "eco") && (
        <>
            <div className={`h-full min-w-50 relative
                            flex flex-col justify-center items-center
                            ${roundstyle == true ? "rounded-r-4xl" : ""}
                            ${booked >= slot ? "cursor-auto bg-gray-400 " : "cursor-pointer"}
                            ${(type === "Phổ thông" && booked < slot) ? "bg-amber-100" : ""}
                            ${(type === "Thương gia" && booked < slot) ? "bg-red-600" : ""}
                          `}
                  onClick={booked < slot ? onClick : null}
            >
                {(booked >= slot) ? (
                  <>
                    <p className="text-2xl inter-semibold text-black capitalize ">{type}</p>
                    <div className="h-10 w-fit m-2 bg-gray-600 rounded-md ">
                      <p className="m-2 text-white">Hết hạng đặt chỗ</p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-2xl inter-semibold text-white capitalize ">{type}</p>
                    <p className="text-lg inter-regular text-white">từ</p>
                    <p className="text-2xl inter-semibold text-white ">{new Intl.NumberFormat('vi-VN').format(price)}</p>
                    <p className='text-lg inter-regular text-white'>VND</p>

                    {(slot-booked < 10 && slot-booked > 0) && (
                      <div className="absolute h-6 w-28 top-[-24px]                    
                      bg-red-700 rounded-t-sm flex justify-center items-center">
                        <p className="text-[14px] inter-semibold text-white ">{slot - booked} chỗ còn lại</p>
                    </div>
                    )}
                  </>
                )}                
            </div>
        </>
      )}
      {(selected && type == "business") && (
        <div className={`h-full min-w-50 relative
                        flex flex-col justify-center items-center
                        ${roundstyle == true ? "rounded-r-4xl" : ""}
                        ${booked >= slot ? "cursor-auto bg-gray-400 " : "cursor-pointer"}
                        ${(type === "Phổ thông" && booked < slot) ? "bg-amber-950" : ""}
                        ${(type === "Thương gia" && booked < slot) ? "bg-red-100" : ""}
                      `}
              onClick={booked < slot ? onClick : null}
        >
            {(booked >= slot) ? (
              <>
                <p className="text-2xl inter-semibold text-black capitalize ">{type}</p>
                <div className="h-10 w-fit m-2 bg-gray-600 rounded-md ">
                  <p className="m-2 text-white">Hết hạng đặt chỗ</p>
                </div>
              </>
            ) : (
              <>
                <p className="text-2xl inter-semibold text-white capitalize ">{type}</p>
                <p className="text-lg inter-regular text-white">từ</p>
                <p className="text-2xl inter-semibold text-white ">{new Intl.NumberFormat('vi-VN').format(price)}</p>
                <p className='text-lg inter-regular text-white'>VND</p>

                {(slot-booked < 10 && slot-booked > 0) && (
                  <div className="absolute h-6 w-28 top-[-24px]                    
                  bg-red-700 rounded-t-sm flex justify-center items-center">
                    <p className="text-[14px] inter-semibold text-white ">{slot - booked} chỗ còn lại</p>
                </div>
                )}
              </>
            )}                
        </div>
      )}
    </>
  )
}
