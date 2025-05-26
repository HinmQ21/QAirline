import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { NavigationIcon } from "./NavigationIcon";
import { useNavigate } from 'react-router-dom';
import { IoLogOutOutline, IoLogOut } from "react-icons/io5";
import toast from 'react-hot-toast';


export const LogoutButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <NavigationIcon
          icon={IoLogOutOutline}
          iconOnHover={IoLogOut}
          className={`${className}`}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="inter-bold">Đăng xuất</DialogTitle>
          <DialogDescription>Bạn sẽ được đăng xuất khỏi trang admin.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose type="button"
            className="cursor-pointer bg-gray-900 hover:bg-gray-700 px-3 py-2 text-white rounded-lg"
          >
            Không
          </DialogClose>
          <DialogClose type="button"
            className="cursor-pointer bg-red-500 hover:bg-red-400 px-3 py-2 text-white rounded-lg"
            onClick={() => onLogoutEvent(navigate)}
          >
            Có
          </DialogClose>
        </DialogFooter>
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
