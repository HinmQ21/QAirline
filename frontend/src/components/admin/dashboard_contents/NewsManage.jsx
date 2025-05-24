import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaRegPenToSquare } from "react-icons/fa6";
import {
  DropdownMenuTrigger, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuContent, DropdownMenu
} from "@/components/ui/dropdown-menu";

export const NewsManageContent = () => {
  const [sortBy, setSortBy] = useState("newest");

  const sortLabels = {
    newest: "Mới nhất",
    "most-popular": "Phổ biến nhất",
    oldest: "Cũ nhất",
  };

  return (
    <div className="h-full">
      <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-between">
          <SortSelection sortLabels={sortLabels} sortBy={sortBy} setSortBy={setSortBy} />
          <CreateNewPostButton />
        </div>
      </div>
    </div>
  );
}

const SortSelection = ({ sortLabels, sortBy, setSortBy }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">
        <p className="poppins-regular">Sắp xếp theo:</p>
        <p className="text-indigo-700 poppins-semibold">{sortLabels[sortBy]}</p>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>{
        Object.entries(sortLabels).map(([value, label]) => (
          <DropdownMenuRadioItem key={value} value={value}>
            {label}
          </DropdownMenuRadioItem>
        ))
      }</DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

const CreateNewPostButton = () => (
  <Button variant="outline">
    <p className="poppins-regular">Đăng bài viết mới</p>
    <FaRegPenToSquare />
  </Button>
)