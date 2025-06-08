import React, { useState } from 'react';

import { useServices } from "@/context/ServiceContext";


export const PeopleSelectModal = ({isOpen, setIsOpen, setTotal}) => {
    //Booking Context
    const { preBookingContext } = useServices();
    
    const [passengers, setPassengers] = useState({
      adult: 0,
      child: 0,
      infant: 0,
    });

    const updateCount = (type, delta) => {
      setPassengers((prev) => {
        // If trying to add a child or infant when no adults, prevent the action
        if (delta > 0 && type !== 'adult' && prev.adult === 0) {
          return prev;
        }
        const newCount = Math.max(0, (prev[type] || 0) + delta);
        return { ...prev, [type]: newCount };
      });
    };

  return (
    <>
      {isOpen && (
      <>
        <div className="fixed inset-0 flex z-50 items-center justify-center overflow-hidden overscroll-contain bg-slate-700/30 transition-all duration-200 ">

          <div className="bg-white z-60 rounded-xl max-h-[calc(100vh-5em)] max-w-lg scale-90 overflow-y-auto overscroll-contain w-full p-6 transition-transform">
            <h2 className="text-center font-bold text-lg mb-4">Chọn số hành khách</h2>

            {/* Passenger Types */}
            {["adult", "child", "infant"].map((type) => (
              <div key={type} className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium">
                  {type == "adult" && "Người lớn"}
                  {type == "child" && "Trẻ em"}
                  {type == "infant" && "Trẻ sơ sinh"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {type === "adult" && "Trên 12 tuổi"}
                    {type === "child" && "Từ 2 đến 11 tuổi"}
                    {type === "infant" && "Dưới 2 tuổi"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={`text-white w-8 h-8 rounded-full ${
                      passengers[type] === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500'
                    }`}
                    onClick={() => updateCount(type, -1)}
                    disabled={passengers[type] === 0}
                  >
                    −
                  </button>
                  <span>{passengers[type]}</span>
                  <button
                    className={`text-white w-8 h-8 rounded-full ${
                      (type !== 'adult' && passengers.adult === 0) 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-red-500'
                    }`}
                    onClick={() => updateCount(type, 1)}
                    disabled={type !== 'adult' && passengers.adult === 0}
                    title={type !== 'adult' && passengers.adult === 0 
                      ? 'At least one adult is required' 
                      : undefined}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between mt-6">
              {/* Close Button */}
              <button
                className="w-[48%] bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded"
                onClick={() => setIsOpen(false)}
              >
                Hủy
              </button>
              
              {/* Confirm Button */}
              <button
                className="w-[48%] bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                onClick={() => {
                  const totalPassengers = passengers.adult + passengers.child + passengers.infant;
                  if (totalPassengers > 0) {
                    // Update booking context with passenger count
                    preBookingContext.updateBooking({ passengers: totalPassengers });
                    
                    // Update total in parent component
                    setTotal(totalPassengers);
                    
                    // Close modal
                    setIsOpen(false);
                  }
                }}
              >
                Xác nhận ({passengers.adult + passengers.child + passengers.infant} người)
              </button>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
    
}