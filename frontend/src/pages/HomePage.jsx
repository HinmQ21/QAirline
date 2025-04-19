import React, { useEffect, useRef, useState } from "react";
import fullpage from "fullpage.js";
import "fullpage.js/dist/fullpage.min.css";
import { Header } from "../components/Header";
import { SloganRow } from "../components/home/Slogans";
import { FlightBooking } from "../components/home/FlightBooking";
import { TopDestinations } from "../components/home/TopDestinations";


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
      <div id="homepage">
        <div className="section homepage-bg">
          <div className="min-h-screen flex flex-col justify-between">
            <div></div>
            <FlightBooking />
            <SloganRow />
          </div>
        </div>
        <div className="section bg-gray-950">
          <div className="p-30">
            <TopDestinations />
          </div>
        </div>
        <div className="section bg-gray-950">
          <p className="w-full text-center text-white">Trang 3</p>
        </div>
      </div>
    </>
  );
}