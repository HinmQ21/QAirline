import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Filter } from "lucide-react";

type FlightsManagerPageTitleProps = {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onCreateFlight: () => void;
}

export const FlightsManagerPageTitle = ({
  statusFilter,
  setStatusFilter,
  onCreateFlight
}: FlightsManagerPageTitleProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Danh sách chuyến bay</h2>
        <p className="text-gray-600 text-sm">Quản lý và theo dõi tất cả chuyến bay trong hệ thống</p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Lọc trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="scheduled">Đã lên lịch</SelectItem>
              <SelectItem value="delayed">Trễ chuyến</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Create Flight Button */}
        <Button onClick={onCreateFlight} className="flex items-center gap-2">
          <Plus size={16} />
          Thêm chuyến bay
        </Button>
      </div>
    </div>
  );
}; 