import { PiAirplaneTilt } from "react-icons/pi";
import { PlaneType, updatePlane } from "@/services/admin/planes"
import { Badge } from "@/components/ui/badge";
import { DeletePlaneButton } from "./DeletePlaneButton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlaneModifyDialog, planeSchema } from "./PlaneModifyDialog";
import { useState } from "react";
import toast from "react-hot-toast";

type PlaneCardProps = {
  plane: PlaneType;
  updatePlaneStateAction: (plane: PlaneType) => void;
  deletePlaneStateAction: (plane_id: number) => void;
}

const PlaneLogo = ({ manufacturer }: { manufacturer: string }) => {
  switch (manufacturer) {
    case "Airbus": return <img src="/planecards/airbus.png" className="h-9" />;
    case "Boeing": return <img src="/planecards/boeing.png" className="h-9" />;
    case "ATR": return <img src="/planecards/atr.png" className="h-9" />;
    case "Embraer": return <img src="/planecards/embraer.png" className="h-9" />;
    default: return <PiAirplaneTilt className="h-9 w-9 text-gray-500" />;
  }
}

export const PlaneCard = ({
  plane,
  updatePlaneStateAction,
  deletePlaneStateAction
}: PlaneCardProps) => {
  const planeForm = useForm<z.infer<typeof planeSchema>>({
    resolver: zodResolver(planeSchema),
    defaultValues: {
      code: plane.code,
      manufacturer: plane.manufacturer,
      model: plane.model,
      total_seats: plane.total_seats
    },
  });

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (values: z.infer<typeof planeSchema>) => {
    setIsSubmitting(true);
    toast.promise(
      updatePlane(plane.airplane_id, values),
      {
        loading: "Đang cập nhật thông tin máy bay",
        error: (err) => {
          console.log(err);
          const res = err.response;
          let errMsg;
          try { errMsg = res.data.message; }
          catch (_) { errMsg = res.toString(); }
          setIsSubmitting(false);
          return `Lỗi khi cập nhật thông tin máy bay: ${errMsg}`;
        },
        success: (data) => {
          console.log(data);
          setOpen(false);
          // not reseting, we keep the latest data
          // planeForm.reset();
          setIsSubmitting(false);
          updatePlaneStateAction(data);
          return "Cập nhật thông tin máy bay thành công!";
        }
      }
    );
  }

  return (
    <div className="
      flex flex-row items-center justify-between pl-3
      bg-white rounded-2xl h-14 w-130 cursor-pointer
      ">
      <PlaneModifyDialog
        open={open} setOpen={setOpen}
        planeForm={planeForm}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        submitText="Cập nhật"
        dialogTitle="Cập nhật máy bay"
      >
        <div className="flex flex-row h-full items-center">
          <div className="w-35 flex flex-col items-center">
            <PlaneLogo manufacturer={plane.manufacturer} />
          </div>
          <div className="w-0.5 h-[60%] bg-gray-600 mx-3" />
          <div className="flex flex-col justify-center w-45">
            <p className="montserrat-semibold text-xl truncate">{plane.code}</p>
            <p className="text-gray-700 text-xs truncate">{`Model: ${plane.model}`}</p>
          </div>
        </div>
      </PlaneModifyDialog>
      <div className="flex flex-row h-full items-center justify-end">
        <Badge className="bg-sky-700 hover:bg-sky-600">
          {`${plane.total_seats} ghế ngồi`}
        </Badge>
        <div className="ml-3 w-0.5 h-[60%] bg-gray-600" />
        <DeletePlaneButton plane_id={plane.airplane_id}
          deletePlaneStateAction={deletePlaneStateAction} />
      </div>
    </div>

  )
}