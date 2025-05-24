import { Fragment } from 'react';
import { IoHomeOutline, IoHome } from "react-icons/io5";
import { IoLogOutOutline, IoLogOut } from "react-icons/io5";
import { FaRegPenToSquare, FaPenToSquare } from "react-icons/fa6";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const navItems = [
  { icon: IoHomeOutline, iconOnHover: IoHome },
  { icon: FaRegPenToSquare, iconOnHover: FaPenToSquare },
];

export const DashboardNavigationIcon = ({ icon: Icon, iconOnHover: IconOnHover, isSelected, onClick, className = "" }) => (
  <div onClick={onClick} className={`
    rounded-4xl shadow-xl cursor-pointer
    relative group
    flex items-center justify-center
    transition-all duration-300

    ${isSelected === true ? (
      "w-14 h-14 bg-indigo-500 shadow-indigo-500/60"
    ) : (
      "w-12 h-12 bg-gray-900 shadow-gray-900/60 \
      hover:w-14 hover:h-14 hover:bg-teal-600 hover:shadow-teal-600/60"
    )
    }
    ${className}
  `}>{
      (isSelected === true) ? (
        <IconOnHover size="24" className="absolute opacity-100 text-white" />
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

export const DashboardNavigation = ({ selectedTab, onTabSelect }) => (
  <div className="flex flex-col h-screen justify-between w-30 items-center">
    <div className="flex flex-col grow justify-center items-center">
      {
        navItems.map((item, idx) => (
          <Fragment key={idx}>
            <DashboardNavigationIcon
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

const LogoutButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DashboardNavigationIcon
          icon={IoLogOutOutline}
          iconOnHover={IoLogOut}
          className={`${className}`}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đăng xuất</DialogTitle>
          <DialogDescription>Bạn sẽ được đăng xuất khỏi trang admin.</DialogDescription>
          <DialogFooter>
            <DialogClose type="button"
              className="cursor-pointer bg-gray-500 px-3 py-2 text-white rounded-xl"
            >
              Không
            </DialogClose>
            <DialogClose type="button"
              className="cursor-pointer bg-red-500 px-3 py-2 text-white rounded-xl"
              onClick={() => onLogoutEvent(navigate)}
            >
              Có
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

const onLogoutEvent = (navigate) => {
  toast.promise(
    async () => {
      localStorage.clear();
      navigate("/admin");
    },
    {
      loading: "Đang chuyển hướng...",
      success: "Đăng xuất thành công!"
    }
  );
}
