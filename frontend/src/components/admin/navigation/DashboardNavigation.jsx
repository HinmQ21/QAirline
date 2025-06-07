import { Fragment } from 'react';
import toast from 'react-hot-toast';
import { LogoutButton } from "./LogoutButton";
import { NavigationIcon } from "./NavigationIcon";
import { Home, PenTool, Plane, BarChart3 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { icon: Home, iconLabel: "Trang chủ", description: "Tổng quan hệ thống" },
  { icon: PenTool, iconLabel: "Tin tức", description: "Quản lý tin tức & thông báo" },
  { icon: Plane, iconLabel: "Máy bay", description: "Quản lý đội bay" },
];

export const DashboardNavigation = ({ selectedTab, onTabSelect }) => (
  <div className="h-full w-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-r border-slate-700">
    {/* Logo Section */}
    <div className="flex items-center justify-center h-16 border-b border-slate-700">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-lg">Q</span>
      </div>
    </div>

    {/* Navigation Items */}
    <div className="flex flex-col items-center py-8 space-y-2">
      {navItems.map((item, idx) => (
        <Fragment key={idx}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onTabSelect(idx)}
                className={`
                  group relative w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center
                  ${selectedTab === idx 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25' 
                    : 'bg-slate-700/50 hover:bg-slate-600/60 hover:shadow-md'
                  }
                `}
              >
                <item.icon 
                  className={`
                    h-5 w-5 transition-all duration-300
                    ${selectedTab === idx ? 'text-white' : 'text-slate-300 group-hover:text-white'}
                  `} 
                />
                
                {/* Active indicator */}
                {selectedTab === idx && (
                  <div className="absolute -right-[1px] top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-l-full" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12} className="bg-slate-800 border-slate-700">
              <div>
                <p className="font-medium text-white">{item.iconLabel}</p>
                <p className="text-xs text-slate-300">{item.description}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </Fragment>
      ))}
    </div>

    {/* Bottom Section */}
    <div className="absolute bottom-0 w-full p-4">
      <div className="flex justify-center">
        <LogoutButton className="w-12 h-12 bg-slate-700/50 hover:bg-red-600/80 border-0 rounded-xl transition-all duration-300" />
      </div>
    </div>
  </div>
);
