import { useEffect, useState } from "react";
import { PlaneType } from "@/services/schemes/planes";
import { ManufacturerType } from "@/services/schemes/planes";
import { PlaneList } from "@/components/admin/airplanes-manager/PlaneList";
import { PlanesManagerpageTitle } from "@/components/admin/airplanes-manager/PageTitle";
import { clientApi } from "@/services/client/main";
import { Card } from "@/components/ui/card";
import { Plane, Settings, Users, MapPin } from "lucide-react";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import toast from "react-hot-toast";

export const PlanesManagerPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [manufacturer, setManufacturer] = useState("all");
  const [planeList, setPlaneList] = useState<PlaneType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(12); // 4x3 grid

  const createPlaneStateAction = (plane: PlaneType) => {
    setPlaneList([plane, ...planeList]);
    setTotalItems(prev => prev + 1);
  }
  
  const updatePlaneStateAction = (plane: PlaneType) => {
    setPlaneList(planeList.map((x) => (x.airplane_id === plane.airplane_id) ? plane : x));
  }
  
  const deletePlaneStateAction = (plane_id: number) => {
    setPlaneList(planeList.filter(p => p.airplane_id !== plane_id));
    setTotalItems(prev => prev - 1);
  }

  const fetchPlanes = async (page: number = 1, selectedManufacturer: string = "all") => {
    setIsLoading(true);
    try {
      let _manufacturer = selectedManufacturer === "all" ? undefined : selectedManufacturer as ManufacturerType;
      
      // Simulate pagination for demo (since API might not support it yet)
      const response = await clientApi.getPlaneList({ manufacturer: _manufacturer });
      
      console.log(response);
      
      // Simulate pagination
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedPlanes = response.slice(startIndex, endIndex);
      
      setPlaneList(paginatedPlanes);
      setTotalItems(response.length);
      setTotalPages(Math.ceil(response.length / itemsPerPage));
      setIsLoading(false);
    } catch (err) {
      let errMsg;
      try { errMsg = err.response.data.message; }
      catch { errMsg = err.toString(); }
      toast.error(errMsg);
      setIsLoading(false);
    }
  };

  // Fetch planes whenever currentPage or manufacturer changes
  useEffect(() => {
    fetchPlanes(currentPage, manufacturer);
  }, [currentPage, manufacturer]);

  // Reset to page 1 when manufacturer changes (but don't trigger double fetch)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [manufacturer]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate dynamic stats
  const activeCount = planeList.filter(p => p.total_seats > 0).length;
  const avgSeats = planeList.length > 0 ? Math.round(planeList.reduce((acc, p) => acc + p.total_seats, 0) / planeList.length) : 0;
  
  const stats = [
    {
      title: "Tổng máy bay",
      value: totalItems.toString(),
      icon: Plane,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Đang hiển thị",
      value: planeList.length.toString(),
      icon: Settings,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Sức chứa TB",
      value: avgSeats.toString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Trang hiện tại",
      value: `${currentPage}/${totalPages}`,
      icon: MapPin,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Quản lý Máy bay</h1>
        <p className="text-cyan-100">Quản lý đội máy bay và thông tin kỹ thuật của QAirline</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Controls Section */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-md">
        <PlanesManagerpageTitle
          manufacturer={manufacturer}
          setManufacturer={setManufacturer}
          createPlaneStateAction={createPlaneStateAction}
        />
      </Card>

      {/* Pagination Info */}
      {!isLoading && totalItems > 0 && (
        <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md">
          <div className="flex items-center justify-between">
            <PaginationInfo
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
            <div className="text-sm text-gray-500">
              {itemsPerPage} máy bay mỗi trang
            </div>
          </div>
        </Card>
      )}

      {/* Planes List Section */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-md">
        <PlaneList isLoading={isLoading} planeList={planeList}
          updatePlaneStateAction={updatePlaneStateAction}
          deletePlaneStateAction={deletePlaneStateAction} />
      </Card>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="justify-center"
          />
        </Card>
      )}
    </div>
  );
}