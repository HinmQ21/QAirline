import { IoMdArrowBack } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Center, Column, Row } from "@/components/misc/Flucter";
import { PlaneType } from "@/services/schemes/planes";
import { useEffect, useState } from "react";
import { clientApi } from "@/services/client/main";
import { PlaneLogo } from "@/components/admin/airplanes-manager/PlaneCard";

export const UpdateSeatsPage = () => {
  const navigate = useNavigate();
  const { airplane_id } = useParams();
  const airplaneIdNum = airplane_id ? Number(airplane_id) : null;

  if (airplaneIdNum === null || isNaN(airplaneIdNum)) {
    return <div>Tham số máy bay không hợp lệ!</div>;
  }

  /* --------------------------
  |    Đọc dữ liệu máy bay    |
  -------------------------- */

  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [plane, setPlane] = useState<PlaneType | null>(null);

  useEffect(() => {
    clientApi.getPlane(airplaneIdNum).then(
      (planeData) => setPlane(planeData)
    ).catch(
      (error) => {
        console.error("Lỗi khi lấy dữ liệu máy bay:", error);
        setErrMsg("Không thể lấy dữ liệu máy bay. Vui lòng thử lại sau.");
      }
    );
  }, []);

  return (
    <div className="w-screen min-h-screen bg-gray-200">
      {/* Xử lý dữ liệu */}

      {errMsg && <Center vertical>{errMsg}</Center>}
      {plane === null && <Center vertical>Đang tải dữ liệu...</Center>}



      {/* Hiển thị thông tin
      máy bay khi có kết quả */}

      {plane !== null && <>
        <div className="h-10" />

        {/* Button to go back */}

        <Button className="ml-16 bg-cyan-700 hover:bg-cyan-600"
          onClick={
            () => navigate('/admin/dashboard')
          }
        >
          <IoMdArrowBack />
          Quay về trang truớc
        </Button>

        <div className="h-10" />

        {/* plane information */}

        <div className="mx-50">
          {/* Row */}
          <div className="flex flex-row justify-around">

            {/* Column - spacing = 1 */}
            <div className="flex flex-col items-center gap-y-1">

              {/* Text - plane code */}
              <p className="montserrat-semibold text-6xl text-gray-900">
                {plane.code}
              </p>

              {/* Row - spacing: 2 */}
              <div className="flex flex-row items-center gap-x-3">

                {/* Text - plane model */}
                <p className="text-gray-700 text-md">
                  Model: {plane.model}
                </p>

                <p>-</p>

                {/* Text - plane id */}
                <p className="text-gray-700 text-md">
                  ID: {plane.airplane_id}
                </p>
              </div>
            </div>


            <div className="flex flex-col items-center">
              <PlaneLogo manufacturer={plane.manufacturer} className="h-20"/>
            </div>
          </div>
        </div>
      </>}
    </div>
  );
}