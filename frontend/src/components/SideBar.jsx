import { Link } from "react-router-dom";
import { VscAzure, VscBroadcast } from "react-icons/vsc";
import { VscCircuitBoard, VscCopilot } from "react-icons/vsc";

export const SideBar = () => {
  return <div className="fixed top-0 left-0 h-screen w-16 m-0
                         flex flex-col items-center justify-center
                         bg-[#202225] text-[#5865f2] shadow-lg">
    <SideBarIcon icon={<VscAzure size="28" />}/>
    <SideBarIcon icon={<VscBroadcast size="28" />}/>
    <SideBarIcon icon={<VscCircuitBoard size="28" />}/>
    <SideBarIcon icon={<VscCopilot size="28" />}/>
  </div>
}

const SideBarIcon = ({icon, text = 'tooltip 💡'}) => (
  <div className="sidebar-icon group">
    {icon}

    <span class='sidebar-tooltip group-hover:scale-100'>
      {text}
    </span>
  </div>
)