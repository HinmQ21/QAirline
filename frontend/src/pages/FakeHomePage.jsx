import React, { useEffect, useRef, useState } from "react";
import fullpage from "fullpage.js";
import "fullpage.js/dist/fullpage.min.css";
import { Header } from "../components/Header";

function FakeHomePage() {
  const fullpageInstance = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [currentDestination, setCurrentDestination] = useState(0);

  useEffect(() => {
    fullpageInstance.current = new fullpage("#fullpage", {
      autoScrolling: true,
      navigation: true,

      onLeave: (origin, destination, direction) => {
        if (origin.index === 0 && direction === "down") {
          setShowScrollHint(false);
        }
        else {
          if (destination.index === 0 && direction == "up") {
            setShowScrollHint(true);
          }
        }
        setCurrentDestination(destination.index);
      },

      afterLoad: (origin, destination, direction) => {

      },
    });

    return () => {
      if (fullpageInstance.current) {
        fullpageInstance.current.destroy("all");
      }
    };
  }, []);

  // Vị trí theo section (mày chỉnh bao nhiêu section cũng được)
  const getTransform = () => {
    switch (currentDestination) {
      case 0:
        return "translate(10px, 10px)";
      case 1:
        return "translate(calc(100vw - 200px), calc(100vh - 60px))";
      case 2:
        return "translate(50vw, 50vh)";
      default:
        return "translate(10px, 10px)";
    }
  };

  return (
    <>
      <Header isAtTop={currentDestination === 0} />
      {/* Dòng chữ xuyên suốt, di chuyển mượt */}
      <div
        style={{
          position: "fixed",
          transform: getTransform(),
          transition: "transform 0.8s ease-in-out",
          color: "#000",
          fontWeight: "bold",
          fontSize: "20px",
          zIndex: 1000,
        }}
      >
        I am batman
      </div>

      <div id="fullpage">
        <div
          className="section"
          style={{
            position: "relative",
            backgroundImage: `linear-gradient(
              to right,
              rgba(0,0,0,0.7) 0%,
              rgba(0,0,0,0.5) 30%,
              rgba(0,0,0,0.0) 100%
            ), 
            url('/home/bg.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h1 style={{ textAlign: "center", marginTop: "40vh" }}>Welcome to the site</h1>
          <p
            onClick={() => window.fullpage_api?.moveSectionDown()}
            className={`absolute bottom-5 w-full text-center font-bold
            cursor-pointer text-[18px] text-black transition-opacity duration-600 ease-in-out
              ${showScrollHint ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
            Scroll to see more ↓
          </p>
        </div>

        <div className="section">Trang 2</div>
        <div className="section">Trang 3</div>
      </div>
    </>
  );
}

export default FakeHomePage;
