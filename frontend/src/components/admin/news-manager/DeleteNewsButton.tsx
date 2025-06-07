import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  DialogContent, DialogDescription, DialogFooter,
  Dialog, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { adminApi } from "@/services/admin/main";

type DeleteNewsButtonProps = {
  news_id: number;
  deleteNewsStateAction: (news_id: number) => void;
  className?: string;
}

export const DeleteNewsButton = (
  { news_id, deleteNewsStateAction, className = "" }: DeleteNewsButtonProps
) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDeleteEvent = () => {
    setIsDeleting(true);
    toast.promise(
      adminApi.deleteNews(news_id),
      {
        loading: "Đang xóa bài viết",
        error: (err) => {
          console.log(err);
          const res = err.response;
          let errMsg;
          try { errMsg = res.data.message; }
          catch (_) { errMsg = res.toString(); }
          setIsDeleting(false);
          return `Lỗi khi xóa bài viết: ${errMsg}`;
        },
        success: (_) => {
          setOpen(false);
          setIsDeleting(false);
          deleteNewsStateAction(news_id);
          return "Xóa bài viết thành công!";
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
          <DialogTitle className="text-lg font-bold">Xóa bài viết này?</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-600">
          Bạn không thể hoàn tác thao tác xóa này! Bài viết sẽ bị xóa vĩnh viễn.
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
