import { Link } from "react-router-dom";


export const Header = ({ isAtTop=false }) => (
  <div className={
    `header ${isAtTop ? 'header-top' : 'header-scrolled'}`
  }>
    <div className="flex items-center ml-10">
      <Link to="/" className="special-gothic-expanded-one-regular">QAIRLINE</Link>
      <div className="flex ml-22 gap-x-10">
        <Link to="/" className="header-link poppins-regular">Home</Link>
        <Link to="/flights" className="header-link poppins-regular">Flights</Link>
        <Link to="/destinations" className="header-link poppins-regular">Destinations</Link>
        <Link to="/contact" className="header-link poppins-regular">Contact</Link>
      </div>
    </div>

    <div className="flex items-center mr-10 gap-x-4">
      <button className="header-link poppins-regular">Sign in</button>
      <p className="poppins-regular text-base">{'|'}</p>
      <button className="cursor-pointer poppins-regular text-base
      bg-red-500 border border-black
        rounded-xl py-2 px-3
        hover:border-white transition-all duration-150
      ">Sign up</button>
    </div>
  </div>
)