import { z } from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PiAirplaneTilt } from "react-icons/pi";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlaneType } from "@/services/schemes/planes";
import { DeletePlaneButton } from "./DeletePlaneButton";
import { PlaneModifyDialog, planeSchema } from "./PlaneModifyDialog";
import { SeatManagementDialog } from "./SeatManagementDialog";
import { adminApi } from "@/services/admin/main";
import { Edit, Users, Settings, Plane } from "lucide-react";

type PlaneCardProps = {
  plane: PlaneType;
  updatePlaneStateAction: (plane: PlaneType) => void;
  deletePlaneStateAction: (plane_id: number) => void;
}

export const PlaneLogo = ({
  manufacturer,
  className,
}: {
  manufacturer: string;
  className?: string | undefined;
}) => {
  switch (manufacturer) {
    case "Airbus":
      return <img src="/planecards/airbus.png" className={className} alt="Airbus" />;
    case "Boeing":
      return <img src="/planecards/boeing.png" className={className} alt="Boeing" />;
    case "ATR":
      return <img src="/planecards/atr.png" className={className} alt="ATR" />;
    case "Embraer":
      return <img src="/planecards/embraer.png" className={className} alt="Embraer" />;
    default:
      return <PiAirplaneTilt className={`text-gray-500 ${className}`} />;
  }
};

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
      adminApi.updatePlane(plane.airplane_id, values),
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
          setIsSubmitting(false);
          updatePlaneStateAction(data);
          return "Cập nhật thông tin máy bay thành công!";
        }
      }
    );
  }

  const getManufacturerColor = (manufacturer: string) => {
    switch (manufacturer) {
      case "Airbus":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Boeing":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "ATR":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "Embraer":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getManufacturerGradient = (manufacturer: string) => {
    switch (manufacturer) {
      case "Airbus":
        return "from-blue-50 to-blue-100";
      case "Boeing":
        return "from-green-50 to-green-100";
      case "ATR":
        return "from-purple-50 to-purple-100";
      case "Embraer":
        return "from-orange-50 to-orange-100";
      default:
        return "from-gray-50 to-gray-100";
    }
  };

  return (
    <Card className="overflow-hidden bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
      {/* Compact Image Section */}
      <div className={`bg-gradient-to-br ${getManufacturerGradient(plane.manufacturer)} px-4 py-5 border-b border-gray-100`}>
        <div className="flex flex-col items-center space-y-3">
          {/* Optimized Logo Size */}
          <div className="w-24 h-18 flex items-center justify-center">
            <PlaneLogo manufacturer={plane.manufacturer} className="h-full w-full object-contain" />
          </div>
          
          {/* Compact Manufacturer Badge */}
          <Badge className={`${getManufacturerColor(plane.manufacturer)} border-0 font-medium px-2 py-1 text-xs`}>
            {plane.manufacturer}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header with ID */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gray-500">
            ID: {plane.airplane_id}
          </div>
        </div>

        <div className="mb-3">
          {/* Plane Code */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {plane.code}
          </h3>
          
          {/* Model */}
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Model:</span> {plane.model}
          </p>

          {/* Seat Information */}
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              <span className="font-medium">{plane.total_seats}</span> ghế ngồi
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">Hoạt động</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <PlaneModifyDialog
              open={open} setOpen={setOpen}
              planeForm={planeForm}
              airplaneId={plane.airplane_id}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              submitText="Cập nhật"
              dialogTitle="Cập nhật máy bay"
            >
              <button className="flex items-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200 text-xs font-medium">
                <Edit className="h-3 w-3" />
                <span>Sửa</span>
              </button>
            </PlaneModifyDialog>

            <SeatManagementDialog 
              plane={plane} 
              updatePlaneStateAction={updatePlaneStateAction}
            >
              <button className="flex items-center space-x-2 px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors duration-200 text-xs font-medium">
                <Plane className="h-3 w-3" />
                <span>Ghế</span>
              </button>
            </SeatManagementDialog>
          </div>

          <DeletePlaneButton 
            plane_id={plane.airplane_id} 
            deletePlaneStateAction={deletePlaneStateAction}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
          />
        </div>
      </div>
    </Card>
  );
}
