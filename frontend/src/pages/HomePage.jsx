import React, { useEffect, useRef, useState } from "react";
import fullpage from "fullpage.js";
import "fullpage.js/dist/fullpage.min.css";
import { Header } from "../components/Header";
import { CalendarDays, User } from "lucide-react";
import { GoShieldCheck, GoGlobe } from "react-icons/go";
import { PiAirplaneTakeoffThin } from "react-icons/pi";


const FlightBooking = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  return (
    <div className="text-white mb-10 mx-10 w-fit md:w-[60%] xl:w-[40%]">
      <h1 className="inter-semibold text-3xl sm:text-5xl font-bold mb-4">
        EXPERIENCE THE FUTURE OF AIR TRAVEL
      </h1>
      <p className="text-gray-300 text-base lg:text-lg mb-10">
        Book your premium flights with speed, safety, and style.
      </p>

      <div className="bg-gray-950 opacity-80 p-5 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-gray-800 text-white p-3 rounded"
          />
          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-gray-800 text-white p-3 rounded"
          />
          {/* <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          className="bg-gray-800 text-white p-3 rounded"
        /> */}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 items-center">
          {/* <div className="flex items-center gap-2 bg-gray-800 p-3 rounded relative">
          <CalendarDays className="w-5 h-5" />
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="bg-transparent w-full outline-none text-white peer"
          />
          {!departureDate && (
            <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none peer-focus:hidden">
              Departure date
            </span>
          )}
        </div> */}
          <div className="flex items-center gap-2 bg-gray-800 p-3 rounded">
            <User className="w-5 h-5" />
            <input
              type="number"
              min="1"
              placeholder="Passengers"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="bg-transparent w-full outline-none text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded">
            Search Flights
          </button>
        </div>
      </div>
    </div>
  );
};


const Slogan = ({ icon, currentDest, children }) => {
  const isDest1 = currentDest === 1;
  console.log(currentDest);

  return (
    <div
      className={`flex items-center justify-center transition-all duration-500 ease-in-out ${
        isDest1 ? 'flex-col' : 'flex-row'
      }`}
    >
      <div
        className={`transition-all duration-500 ease-in-out ${
          isDest1 ? 'scale-250 mb-10' : 'scale-100 mr-3'
        }`}
      >
        {icon}
      </div>
      <p
        className={`poppins-regular transition-all duration-500 ease-in-out ${
          isDest1 ? 'text-center text-2xl' : 'text-xl'
        }`}
      >
        {children}
      </p>
    </div>
  );
};


const SloganRow = ({ currentDest }) => {
  let y;
  switch (currentDest) {
    case 0:
      y = 'calc(100vh - 100px)';
      break;
    case 1:
      y = '70px';
      break;
    default:
      y = null;
  }

  return (
    <div
      className={`flex w-full text-center justify-around text-white
                  ${currentDest <= 1 ? 'scale-100' : 'scale-0'}
                  bg-gray-950 fixed transition-all duration-500 ease-in-out z-1 py-9`}
      style={{ transform: `translate(0, ${y})` }}
    >
      <Slogan icon={<PiAirplaneTakeoffThin size='24'/>} currentDest={currentDest}>Fast Booking</Slogan>
      <Slogan icon={<GoShieldCheck size='24'/>} currentDest={currentDest}>Secure & Reliable</Slogan>
      <Slogan icon={<GoGlobe size='24'/>} currentDest={currentDest}>Global Destinations</Slogan>
    </div>
  );
};


export const HomePage = () => {
  const fullpageInstance = useRef(null);
  const [currentDest, setCurrentDest] = useState(0);

  useEffect(() => {
    fullpageInstance.current = new fullpage("#homepage", {
      autoScrolling: true,
      navigation: true,

      onLeave: (origin, destination, direction) => {
        // if (origin.index === 0 && direction === "down") {
        // }
        // else {
        //   if (destination.index === 0 && direction == "up") {
        //   }
        // }
        setCurrentDest(destination.index);
      },

      afterLoad: (origin, destination, direction) => {

      },
    });

    return () => {
      if (fullpageInstance.current) {
        fullpageInstance.current.destroy("all");
      }
    }
  }, []);

  return (
    <>
      <Header isAtTop={currentDest === 0} />
      <SloganRow currentDest={currentDest} />
      <div id="homepage">
        <div className="section homepage-bg">
          <FlightBooking />
        </div>
        <div className="section bg-gray-950">
          <p className="w-full text-center text-white">Trang 2</p>
        </div>
        <div className="section bg-gray-950">
          <p className="w-full text-center text-white">Trang 3</p>
        </div>
      </div>
    </>
  );
}