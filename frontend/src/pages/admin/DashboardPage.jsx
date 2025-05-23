import { IoHomeOutline, IoHome } from "react-icons/io5";

export const AdminDashboardPage = () => {
  return (
    <div className="flex flex-row min-h-screen min-w-screen bg-gray-300">
      <DashboardNavigationTabs />
    </div>
  );
}

const DashboardNavigationTabs = () => {
  return <div className="flex flex-col min-h-screen justify-center w-30 items-center">
    <div className="rounded-4xl shadow-xl transition-all duration-300 relative group
                    flex flex-row items-center justify-center
                    w-12 h-12 bg-gray-900 shadow-gray-900/60 cursor-pointer
                    hover:w-14 hover:h-14 hover:bg-indigo-500 hover:shadow-indigo-500/60">
      <IoHomeOutline size="20" className="absolute opacity-100 group-hover:opacity-0 text-white transition-opacity duration-300" />
      <IoHome size="24" className="absolute opacity-0 group-hover:opacity-100 text-white transition-opacity duration-300" />
    </div>
    <div className=" w-[2px] h-5 bg-gray-600"></div>
    <div className="rounded-4xl shadow-xl transition-all duration-300 relative group
                    flex flex-row items-center justify-center
                    w-12 h-12 bg-gray-900 shadow-gray-900/60 cursor-pointer
                    hover:w-14 hover:h-14 hover:bg-indigo-500 hover:shadow-indigo-500/60">
      <IoHomeOutline size="20" className="absolute opacity-100 group-hover:opacity-0 text-white transition-opacity duration-300" />
      <IoHome size="24" className="absolute opacity-0 group-hover:opacity-100 text-white transition-opacity duration-300" />
    </div>
  </div>
}