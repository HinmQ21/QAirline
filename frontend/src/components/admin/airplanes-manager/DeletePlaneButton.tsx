import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { deletePlane } from "@/services/admin/planes";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiFillDelete, AiOutlineDelete } from "react-icons/ai";

type DeletePlaneButtonProps = {
  plane_id: number;
  deletePlaneStateAction: (plane_id: number) => void;
}

export const DeletePlaneButton = (
  { plane_id, deletePlaneStateAction }: DeletePlaneButtonProps
) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDeleteEvent = () => {
    setIsDeleting(true);
    toast.promise(
      deletePlane(plane_id),
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
      <DialogTrigger>
        <div className="
                    w-9 relative h-full text-red-600
                    flex flex-row items-center justify-center
                  ">
          <AiOutlineDelete size={20} className="absolute cursor-pointer
                      opacity-100 hover:opacity-0 transition-all duration-200" />
          <AiFillDelete size={20} className="absolute cursor-pointer
                      opacity-0 hover:opacity-100 transition-all duration-200" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa máy bay này?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Bạn không thể hoàn tác thao tác xóa này!
        </DialogDescription>
        <DialogFooter>
          <Button className="bg-gray-900 hover:bg-gray-700
            cursor-pointer px-3 py-2 text-white rounded-lg"
            disabled={isDeleting} onClick={() => setOpen(false)}
          >
            Không
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-400
            cursor-pointer px-3 py-2 text-white rounded-lg"
            disabled={isDeleting} onClick={onDeleteEvent}
          >
            Có
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
