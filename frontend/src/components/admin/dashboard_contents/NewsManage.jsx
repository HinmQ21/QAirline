import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaRegPenToSquare } from "react-icons/fa6";
import {
  DropdownMenuTrigger, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuContent, DropdownMenu
} from "@/components/ui/dropdown-menu";

const sortLabels = {
  newest: "Mới nhất",
  "most-popular": "Phổ biến nhất",
  oldest: "Cũ nhất",
};

const categoryLabels = {
  all: "Tất cả",
  introduction: "Giới thiệu",
  promotion: "Khuyến mãi",
  news: "Tin tức",
  announcement: "Thông báo"
};

export const NewsManageContent = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [category, setCategory] = useState("all");

  return (
    <div className="w-full">
      <NewsManageContentTitle
        sortBy={sortBy} setSortBy={setSortBy}
        category={category} setCategory={setCategory}
      />
      
    </div>
  );
}

const NewsManageContentTitle = ({ sortBy, setSortBy, category, setCategory }) => {
  <div className="flex flex-row justify-around">
    <div className="flex flex-row gap-4">
      <DropdownSelect title="Sắp xếp theo"
        labelMap={sortLabels} item={sortBy} setItem={setSortBy} />
      <DropdownSelect title="Danh mục"
        labelMap={categoryLabels} item={category} setItem={setCategory} />
    </div>
    <CreateNewPostButton />
  </div>
};

const DropdownSelect = ({ title, labelMap, item, setItem }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">
        <p className="poppins-regular">{title}:</p>
        <p className="text-indigo-700 poppins-semibold">{labelMap[item]}</p>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuRadioGroup value={item} onValueChange={setItem}>{
        Object.entries(labelMap).map(([value, label]) => (
          <DropdownMenuRadioItem key={value} value={value}>
            {label}
          </DropdownMenuRadioItem>
        ))
      }</DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

const CreateNewPostButton = ({ className }) => (
  <Button variant="outline" className={`${className}`}>
    <p className="poppins-regular">Đăng bài viết mới</p>
    <FaRegPenToSquare />
  </Button>
);
