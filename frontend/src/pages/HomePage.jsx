import { css } from "@/css/styles";
import fullpage from "fullpage.js";
import "fullpage.js/dist/fullpage.min.css";
import { Star, Users, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TopNews } from "@/components/home/TopNews";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { SloganRow } from "@/components/home/Slogans";
import { Sponsors } from "@/components/home/Sponsors";
import { TopDestinations } from "@/components/home/TopDestinations";
import { Testimonials } from "@/components/home/Testimonials";
import { motion } from "framer-motion";

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
            <div className="absolute inset-0"></div>

            {/* Hero content */}
            <div className="z-10 flex-1 flex flex-col justify-center items-center text-center px-4">
              <div data-animate className="space-y-4 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  Hành Trình <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">Bắt Đầu Từ Đây</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                  Khám phá những điểm đến tuyệt vời với những chuyến bay giá tốt nhất trên toàn thế giới
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 mt-6 max-w-lg mx-auto">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="text-blue-400 w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-white">1M+</div>
                    <div className="text-gray-300 text-sm">Hành Khách Hài Lòng</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Globe className="text-green-400 w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-gray-300 text-sm">Điểm Đến</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="text-yellow-400 w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-white">4.9</div>
                    <div className="text-gray-300 text-sm">Đánh Giá</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slogans */}
            <div className="z-10">
              <SloganRow />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={`section ${css.homepageGgGradient}`}>
          <div className="min-h-screen flex flex-col justify-start">
            <div className={`${css.minipage.lg} ${css.minipagemx} mt-25 mb-10 transform transition-all duration-1000`}>
              <div data-animate>
                <TopNews />
              </div>
            </div>
            <div className={`${css.minipage.xl} mb-10 ${css.minipagemx} backdrop-blur-sm`}>
              <div className="m-15" data-animate>
                <TopDestinations />
              </div>
            </div>
          </div>
        </div>

        {/* <div className={`section ${css.homepageGgGradient}`}>
          <div className="mt-30">
            <Testimonials />

          </div>
        </div> */}

        {/* Footer Section */}
        <div className={`section ${css.homepageGgGradient}`}>
          <div className="min-h-screen flex flex-col justify-between">
            <div className={`${css.minipage.xl} mt-25 mb-10 ${css.minipagemx}`}>
              <div data-animate>
                <Testimonials />
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