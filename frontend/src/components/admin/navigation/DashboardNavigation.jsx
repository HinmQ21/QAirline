import { Fragment } from 'react';
import toast from 'react-hot-toast';
import { LogoutButton } from "./LogoutButton";
import { NavigationIcon } from "./NavigationIcon";
import { IoHomeOutline, IoHome } from "react-icons/io5";
import { IoAirplane, IoAirplaneOutline } from "react-icons/io5";
import { FaRegPenToSquare, FaPenToSquare } from "react-icons/fa6";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


const navItems = [
  { icon: IoHomeOutline, iconOnHover: IoHome, iconLabel: "Home" },
  { icon: FaRegPenToSquare, iconOnHover: FaPenToSquare, iconLabel: "News" },
  { icon: IoAirplaneOutline, iconOnHover: IoAirplane, iconLabel: "Airplanes" }
];

export const DashboardNavigation = ({ selectedTab, onTabSelect }) => (
  <div className="flex flex-col h-screen justify-between w-30 items-center">
    <div className="flex flex-col grow justify-center items-center">
      {
        navItems.map((item, idx) => (
          <Fragment key={idx}>
            <Tooltip>
              <TooltipTrigger>
                <NavigationIcon
                  icon={item.icon}
                  iconOnHover={item.iconOnHover}
                  isSelected={selectedTab === idx}
                  onClick={() => onTabSelect(idx)}
                />
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={4}>
                {item.iconLabel}
              </TooltipContent>
            </Tooltip>
            {(idx !== navItems.length - 1) && <div className="w-[2px] h-5 bg-gray-600" />}
          </Fragment>
        ))
      }
    </div>
    <LogoutButton className="mb-5" />
  </div>
);
