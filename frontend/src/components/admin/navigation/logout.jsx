import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { NavigationIcon } from "./nav-icon";
import { useNavigate } from 'react-router-dom';
import { IoLogOutOutline, IoLogOut } from "react-icons/io5";


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