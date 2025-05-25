import { Button } from "@/components/ui/button";
import { FaRegPenToSquare } from "react-icons/fa6";

export const CreateNewsButton = ({ className }) => (
  <Button variant="outline" className={`${className}`}>
    <p className="poppins-regular">Đăng bài viết mới</p>
    <FaRegPenToSquare />
  </Button>
);
