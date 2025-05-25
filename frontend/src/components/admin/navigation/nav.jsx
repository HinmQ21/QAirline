import { Fragment } from 'react';
import toast from 'react-hot-toast';
import { LogoutButton } from "./logout";
import { NavigationIcon } from "./nav-icon";
import { IoHomeOutline, IoHome } from "react-icons/io5";
import { FaRegPenToSquare, FaPenToSquare } from "react-icons/fa6";

const navItems = [
  { icon: IoHomeOutline, iconOnHover: IoHome },
  { icon: FaRegPenToSquare, iconOnHover: FaPenToSquare },
];

export const DashboardNavigation = ({ selectedTab, onTabSelect }) => (
  <div className="flex flex-col h-screen justify-between w-30 items-center">
    <div className="flex flex-col grow justify-center items-center">
      {
        navItems.map((item, idx) => (
          <Fragment key={idx}>
            <NavigationIcon
              icon={item.icon}
              iconOnHover={item.iconOnHover}
              isSelected={selectedTab === idx}
              onClick={() => onTabSelect(idx)}
            />
            {(idx === 0) && <div className="w-[2px] h-5 bg-gray-600" />}
          </Fragment>
        ))
      }
    </div>
    <LogoutButton className="mb-5" />
  </div>
);
