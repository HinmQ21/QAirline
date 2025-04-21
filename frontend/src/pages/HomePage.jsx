import React, { useEffect, useRef, useState } from "react";
import fullpage from "fullpage.js";
import "fullpage.js/dist/fullpage.min.css";
import { LuNewspaper } from "react-icons/lu";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SloganRow } from "../components/home/Slogans";
import { FlightBooking } from "../components/home/FlightBooking";
import { TopDestinations } from "../components/home/TopDestinations";
import { WhyChooseUs } from "../components/home/WhyChooseUs";
import { ResponsiveComponent } from "../components/ResponsiveComponent";
import { Sponsors } from "../components/home/Sponsors";



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
        <div className="section homepage-bg-image">
          <div className="min-h-screen flex flex-col justify-between">
            <div></div>
            <FlightBooking />
            <SloganRow />
          </div>
        </div>
        <div className="section homepage-bg-gradient">
          <div className="min-h-screen flex flex-col justify-start">

            <div className="mini-page mt-25">
              <div className="flex items-center">
                <h4 className="poppins-semibold">
                  Recent News

                </h4>
              </div>
            </div>

            {/* <div className="mt-20 flex items-center justify-between p-4 border rounded-lg bg-white">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-blue-600 font-semibold space-x-2">
                  <i className="fas fa-calendar-alt"></i>
                  <span>Tin tức</span>
                </div>

                <div className="text-gray-500 text-sm">28/03/2025</div>

                <a
                  href="#"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Bamboo Airways thông báo về quy định mang theo và sử dụng thiết bị sạc điện có chứa pin
                </a>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-500">1/3</div>
                <button className="text-blue-600 font-semibold hover:underline">
                  Xem Thêm →
                </button>
              </div>
            </div> */}
            <div className="mini-page mb-10 ">
              <div className="m-15">
                <TopDestinations />
              </div>
              <div className="m-15 mt-22">
                <WhyChooseUs />
              </div>
            </div>
          </div>
        </div>
        <div className="section homepage-bg-gradient">
          <div className="min-h-screen flex flex-col justify-between">
            <div className="mini-page mt-25 mb-10">
              {/* <ResponsiveComponent /> */}
              <div className="flex flex-col items-center my-10 gap-3">
                <h2 className="inter-semibold">More content</h2>
                <img src="/miscs/coming-soon.gif" loading="lazy" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mini-page mb-10">
                <div className="m-10">
                  <Sponsors />
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}