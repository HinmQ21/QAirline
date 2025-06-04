import { css } from "@/css/styles";
import fullpage from "fullpage.js";
import "fullpage.js/dist/fullpage.min.css";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { SloganRow } from "@/components/home/Slogans";
import { Sponsors } from "@/components/home/Sponsors";
import { MiniPage } from "@/components/misc/MiniPage";
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
            <MiniPage className="mt-25 mb-10 mx-30">
              <div className="flex flex-col m-15 gap-y-22">
                <TopDestinations />
                <WhyChooseUs />
              </div>
            </MiniPage>
          </div>
        </div>
        <div className="section homepage-bg-gradient">
          <div className="min-h-screen flex flex-col justify-between">
            <MiniPage className="mt-25 mb-10 mx-30">
              <div className="flex flex-col items-center my-10 gap-3">
                <p className={css.headerText}>More content</p>
                <img src="/miscs/coming-soon.gif" loading="lazy" />
              </div>
            </MiniPage>
            <div className="flex flex-col">
              <MiniPage className="mb-10 mx-30">
                <div className="m-10">
                  <Sponsors />
                </div>
              </MiniPage>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}