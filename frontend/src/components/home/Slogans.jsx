import { css } from "../../css/styles";
import { PiAirplaneTakeoffThin } from "react-icons/pi";
import { GoShieldCheck, GoGlobe } from "react-icons/go";

const Slogan = ({ icon, children }) => (
  <div className="flex items-center gap-3">
    {icon}
    <p className="reddit-regular text-xl">{children}</p>
  </div>
);


export const SloganRow = () => {
  return (
    <div
      className={`hidden md:flex w-full text-center justify-around
                 text-white z-1 lg:py-7 md:py-5
                 ${css.homepageGgGradient}`}
    >
      <Slogan icon={<PiAirplaneTakeoffThin size='24'/>}>Fast Booking</Slogan>
      <Slogan icon={<GoShieldCheck size='24'/>}>Secure & Reliable</Slogan>
      <Slogan icon={<GoGlobe size='24'/>}>Global Destinations</Slogan>
    </div>
  );
};