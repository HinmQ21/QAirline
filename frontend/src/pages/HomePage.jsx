import { css } from "@/css/styles";
import fullpage from "fullpage.js";
import "fullpage.js/dist/fullpage.min.css";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { SloganRow } from "@/components/home/Slogans";
import { Sponsors } from "@/components/home/Sponsors";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FlightBooking } from "@/components/home/FlightBooking";
import { TopDestinations } from "@/components/home/TopDestinations";

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
      <Header isAtTop={currentDest === 0} className="header-floating" />
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
            <div className={`${css.minipage.xl} mt-25 mb-10 mx-30`}>
              <div className="flex flex-col m-15 gap-y-22">
                <TopDestinations />
                <WhyChooseUs />
              </div>
            </div>
          </div>
        </div>
        <div className="section homepage-bg-gradient">
          <div className="min-h-screen flex flex-col justify-between">
            <div className={`${css.minipage.xl} mt-25 mb-10 mx-30`}>
              <div className="flex flex-col items-center my-10 gap-3">
                <p className={css.headerText}>More content</p>
                <img src="/miscs/coming-soon.gif" loading="lazy" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className={`${css.minipage.xl} mb-10 mx-30`}>
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