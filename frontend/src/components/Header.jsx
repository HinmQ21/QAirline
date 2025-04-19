import { Link } from "react-router-dom";


export const Header = ({ isAtTop }) => (
  <div className={
    `header ${isAtTop ? 'headerTop' : 'headerScrolled'}`
  }>
    <div className="flex items-center ml-8">
      <Link to="/" className="special-gothic-expanded-one-regular">QAIRLINE</Link>
      <div className="flex ml-20 gap-x-10">
        <Link to="/" className="poppins-regular text-base">Home</Link>
        <Link to="/flights" className="poppins-regular text-base">Flights</Link>
        <Link to="/destinations" className="poppins-regular text-base">Destinations</Link>
        <Link to="/contact" className="poppins-regular text-base">Contact</Link>
      </div>
    </div>
    <div className="flex items-center mr-8 gap-x-4">
      <button className="cursor-pointer poppins-regular text-base">Sign in</button>
      <p className="poppins-regular text-base">{'|'}</p>
      <button className="cursor-pointer poppins-regular text-base
      bg-red-500 border border-black
        rounded-xl py-2 px-3
        hover:border-white transition-all duration-150
      ">Sign up</button>
    </div>
  </div>
)