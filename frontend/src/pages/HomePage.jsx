import { css } from "@/css/styles";
import fullpage from "fullpage.js";
import "fullpage.js/dist/fullpage.min.css";
import { useEffect, useRef, useState } from "react";
import { TopNews } from "@/components/home/TopNews";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { SloganRow } from "@/components/home/Slogans";
import { Sponsors } from "@/components/home/Sponsors";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ArrowDown, Star, Users, Globe } from "lucide-react";
import { FlightBooking } from "@/components/home/FlightBooking";
import { TopDestinations } from "@/components/home/TopDestinations";

export const HomePage = () => {
  const fullpageInstance = useRef(null);
  const [currentDest, setCurrentDest] = useState(0);

  useEffect(() => {
    fullpageInstance.current = new fullpage("#homepage", {
      autoScrolling: true,
      navigation: true,
      scrollingSpeed: 1000,
      animateAnchor: true,

      onLeave: (origin, destination, direction) => {
        setCurrentDest(destination.index);
      },

      afterLoad: (origin, destination, direction) => {
        // Add entrance animations for content
        const section = destination.item;
        const content = section.querySelector('[data-animate]');
        if (content) {
          content.classList.add('animate-fade-in-up');
        }
      },
    });

    return () => {
      if (fullpageInstance.current) {
        fullpageInstance.current.destroy("all");
      }
    }
  }, []);

  const scrollToNext = () => {
    if (fullpageInstance.current) {
      fullpageInstance.current.moveSectionDown();
    }
  };

  return (
    <>
      <Header isAtTop={currentDest === 0} className="header-floating" />
      <div id="homepage">
        {/* Hero Section */}
        <div className="section homepage-bg-image relative overflow-hidden">
          <div className="min-h-screen flex flex-col justify-between relative">
            {/* Animated background overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-red-900/30 animate-gradient-x"></div>

            {/* Hero content */}
            <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4">
              <div data-animate className="space-y-6 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  Your Journey <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Starts Here</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
                  Discover amazing destinations with the best flight deals around the world
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 mt-12 max-w-lg mx-auto">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="text-blue-400 w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-white">1M+</div>
                    <div className="text-gray-300 text-sm">Happy Travelers</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Globe className="text-green-400 w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-gray-300 text-sm">Destinations</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="text-yellow-400 w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-white">4.9</div>
                    <div className="text-gray-300 text-sm">Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Booking Widget */}
            <div className="relative z-10 mb-8">
              <FlightBooking />
            </div>

            {/* Slogans */}
            <div className="relative z-10">
              <SloganRow />
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
              <button
                onClick={scrollToNext}
                className="flex flex-col items-center text-white hover:text-blue-400 transition-colors group"
              >
                <span className="text-sm mb-2 opacity-75">Scroll to explore</span>
                <ArrowDown className="w-6 h-6 animate-bounce group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="section homepage-bg-gradient">
          <div className="min-h-screen flex flex-col justify-start">
            <div className={`${css.minipage.lg} ${css.minipagemx} mt-25 mb-10 transform transition-all duration-1000`}>
              <div data-animate>
                <TopNews />
              </div>
            </div>
            <div className={`${css.minipage.xl} mb-10 ${css.minipagemx} backdrop-blur-sm bg-white/10`}>
              <div className="flex flex-col m-15 gap-y-22" data-animate>
                <div className="transform transition-all duration-1000 delay-300">
                  <TopDestinations />
                </div>
                <div className="transform transition-all duration-1000 delay-500">
                  <WhyChooseUs />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="section homepage-bg-gradient">
          <div className="min-h-screen flex flex-col justify-between">
            <div className={`${css.minipage.xl} mt-25 mb-10 ${css.minipagemx}`}>
              <div className="flex flex-col items-center my-10 gap-6" data-animate>
                <h2 className={`${css.headerText} text-center`}>Coming Soon</h2>
                <p className="text-gray-600 text-center max-w-2xl">
                  We're working on exciting new features to make your travel experience even better
                </p>
                <div className="relative">
                  <img
                    src="/miscs/coming-soon.gif"
                    loading="lazy"
                    className="rounded-lg shadow-2xl max-w-md w-full"
                    alt="Coming Soon"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-lg"></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className={`${css.minipage.xl} mb-10 ${css.minipagemx}`}>
                <div className="m-10" data-animate>
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