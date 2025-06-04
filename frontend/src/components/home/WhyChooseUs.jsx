import { css } from "@/css/styles";
import { FiGlobe } from "react-icons/fi";
import { LuPlane } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa";
import { PiSeatBold } from "react-icons/pi";


const ICON_SIZE = "45";

const reasons = [
  {
    icon: <LuPlane size={ICON_SIZE} />,
    title: "Modern Fleet",
    description: "Fly on new, safe, and reliable aircraft."
  },
  {
    icon: <FaRegClock size={ICON_SIZE} />,
    title: "On-Time Guarantee",
    description: "Take off and land right on schedule."
  },
  {
    icon: <PiSeatBold size={ICON_SIZE} />,
    title: "Comfortable Seating",
    description: "Sit back, relax, and enjoy extra comfort."
  },
  {
    icon: <FiGlobe size={ICON_SIZE} />,
    title: "Global Network",
    description: "Reach your favorite places around the world."
  }
];

export const WhyChooseUs = () => (
  <div className="flex flex-col">
    <div className="flex flex-col items-center">
      <p className={`mb-7 ${css.headerText}`}>Why choose us?</p>
      <div className="flex flex-wrap gap-5 max-w-[90%] justify-center">
        {reasons.map((reason, index) => (
          <div key={index} className="flex-1 rounded-xl min-w-50 cursor-pointer
                            bg-gradient-to-tr from-purple-950 to-pink-900 w-full">
            <div className="flex flex-col items-center h-full text-center
                              py-5 gap-4 justify-evenly px-4 text-white">
              <div className="flex flex-col items-center gap-3">
                {reason.icon}
                <h3 className="poppins-semibold text-2xl leading-[28px]">
                  {reason.title}
                </h3>
              </div>
              <p>{reason.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);