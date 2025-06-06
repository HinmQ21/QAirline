import { z } from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/services/admin/main";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlaneType } from "@/services/schemes/planes";
import { IoIosAddCircleOutline } from "react-icons/io";
import { PlaneModifyDialog, planeSchema } from "./PlaneModifyDialog";

type CreatePlaneButtonProps = {
  className?: string | undefined;
  createPlaneStateAction: (news: PlaneType) => void
}

export const CreatePlaneButton = ({
  className, createPlaneStateAction
}: CreatePlaneButtonProps) => {
  const planeForm = useForm<z.infer<typeof planeSchema>>({
    resolver: zodResolver(planeSchema),
    defaultValues: {
      code: "",
      manufacturer: "Airbus",
      model: "",
      total_seats: 300
    },
  });

  const onSubmit = (values: z.infer<typeof planeSchema>) => {
    setIsSubmitting(true);
    toast.promise(
      adminApi.createPlane(values),
      {
        loading: "Đang tạo máy bay mới",
        error: (err) => {
          const res = err.response;
          let errMsg;
          try { errMsg = res.data.message; }
          catch (_) { errMsg = res.toString(); }
          setIsSubmitting(false);
          return `Lỗi khi tạo máy bay: ${errMsg}`;
        },
        success: (data) => {
          console.log(data);
          setOpen(false);
          planeForm.reset();
          setIsSubmitting(false);
          createPlaneStateAction(data);
          return "Tạo máy bay mới thành công!";
        }
      }
    );
  };
  
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  return (
    <PlaneModifyDialog
      dialogTitle="Tạo máy bay mới"
      isSubmitting={isSubmitting}
      open={open} setOpen={setOpen}
      planeForm={planeForm} onSubmit={onSubmit}
      submitText="Submit"
    >
      <Button variant="outline" className={`${className}`}>
        <p className="reddit-regular">Tạo máy bay mới</p>
        <IoIosAddCircleOutline />
      </Button>
    </PlaneModifyDialog>
  );
}