import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { adminApi } from "@/services/admin/main";

type DeletePlaneButtonProps = {
  plane_id: number;
  deletePlaneStateAction: (plane_id: number) => void;
  className?: string;
}

export const DeletePlaneButton = (
  { plane_id, deletePlaneStateAction, className = "" }: DeletePlaneButtonProps
) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDeleteEvent = () => {
    setIsDeleting(true);
    toast.promise(
      adminApi.deletePlane(plane_id),
      {
        loading: "Đang xóa máy bay",
        error: (err) => {
          console.log(err);
          const res = err.response;
          let errMsg;
          try { errMsg = res.data.message; }
          catch (_) { errMsg = res.toString(); }
          setIsDeleting(false);
          return `Lỗi khi xóa máy bay: ${errMsg}`;
        },
        success: (_) => {
          setOpen(false);
          setIsDeleting(false);
          deletePlaneStateAction(plane_id);
          return "Xóa máy bay thành công!";
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`${className}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Xóa máy bay này?</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-600">
          Bạn không thể hoàn tác thao tác xóa này! Máy bay sẽ bị xóa vĩnh viễn khỏi hệ thống.
        </DialogDescription>
        <DialogFooter className="gap-2">
          <Button 
            variant="outline"
            disabled={isDeleting} 
            onClick={() => setOpen(false)}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            disabled={isDeleting} 
            onClick={onDeleteEvent}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
