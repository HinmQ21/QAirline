import React, { useState } from 'react';

export const PeopleSelectModal = ({isOpen, setIsOpen}) => {
    const [passengers, setPassengers] = useState({
      adult: 1,
      child: 0,
      infant: 0,
    });

    const updateCount = (type, delta) => {
      setPassengers((prev) => {
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
            <h2 className="text-center font-bold text-lg mb-4">Select Passengers</h2>

            {/* Passenger Types */}
            {["adult", "child", "infant"].map((type) => (
              <div key={type} className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium capitalize">{type}</p>
                  <p className="text-sm text-gray-500">
                    {type === "adult" && "More than 12 years old"}
                    {type === "child" && "2-11 years old"}
                    {type === "infant" && "Less than 2 years old"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="bg-red-500 text-white w-8 h-8 rounded-full"
                    onClick={() => updateCount(type, -1)}
                  >
                    −
                  </button>
                  <span>{passengers[type]}</span>
                  <button
                    className="bg-red-500 text-white w-8 h-8 rounded-full"
                    onClick={() => updateCount(type, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between mt-6">
              {/* Close Button */}
              <button
                className="w-[48%] bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>

              {/* Continue Button */}
              <button
                className="w-[48%] bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                onClick={() => {
                  // Add your logic for "Continue" here
                  setIsOpen(false);
                  navigate("/searchflights");
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
    
}