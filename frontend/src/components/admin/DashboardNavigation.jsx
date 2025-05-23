import React from "react";
import { IoHomeOutline, IoHome } from "react-icons/io5";
import { FaRegPenToSquare, FaPenToSquare } from "react-icons/fa6";

const navItems = [
  { icon: IoHomeOutline, iconOnHover: IoHome },
  { icon: FaRegPenToSquare, iconOnHover: FaPenToSquare },
];

export const DashboardNavigationIcon = ({ icon: Icon, iconOnHover: IconOnHover, isSelected, onClick }) => (
  <div onClick={onClick} className={`
      rounded-4xl shadow-xl transition-all duration-300 relative group
      flex flex-row items-center justify-center
      ${isSelected === true ? (
      "w-14 h-14 bg-indigo-500 shadow-indigo-500/60"
    ) : (
      "w-12 h-12 bg-gray-900 shadow-gray-900/60 cursor-pointer"
    )}
      hover:w-14 hover:h-14 hover:bg-teal-600 hover:shadow-teal-600/60
  `}>{
      (isSelected === true) ? (
        <Icon size="24" className="absolute opacity-100 text-white" />
      ) : (
        <>
          <Icon size="20" className="
            absolute opacity-100 text-white
            group-hover:opacity-0 transition-opacity duration-300
        "/>
          <IconOnHover size="24" className="
            absolute opacity-0 text-white
            group-hover:opacity-100 transition-opacity duration-300
        "/>
        </>
      )
    }</div>
)

export const DashboardNavigation = ({ selectedTab, onTabSelect }) => {
  return <div className="flex flex-col min-h-screen justify-center w-30 items-center">
    {
      navItems.map((item, idx) => (
        <React.Fragment key={idx}>
          <DashboardNavigationIcon
            icon={item.icon}
            iconOnHover={item.iconOnHover}
            isSelected={selectedTab === idx}
            onClick={() => onTabSelect(idx)}
          />
          {(idx === 0) && <div className=" w-[2px] h-5 bg-gray-600"></div>}
        </React.Fragment>
      ))
    }
  </div>;
};
