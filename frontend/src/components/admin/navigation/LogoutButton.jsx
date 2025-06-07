import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut } from "lucide-react";
import toast from 'react-hot-toast';
import { adminApi } from '@/services/admin/main';

export const LogoutButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`${className} text-slate-300 hover:text-white hover:bg-red-600/80`}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Đăng xuất</DialogTitle>
          <DialogDescription>Bạn sẽ được đăng xuất khỏi trang admin.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">
              Không
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button 
              variant="destructive"
              onClick={() => onLogoutEvent(navigate)}
            >
              Có
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const onLogoutEvent = (navigate) => {
  adminApi.logout();
  navigate("/admin");
  toast.success("Đăng xuất thành công!");
}
