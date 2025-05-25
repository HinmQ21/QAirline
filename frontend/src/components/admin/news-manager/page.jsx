import { useState } from "react";
import { CreateNewsButton } from "./create-news";
import { DropdownSelect } from "@/components/misc/DropdownSelect";

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

export const NewsManagerPage = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [category, setCategory] = useState("all");

  return (
    <div className="w-full">
      <NewsManagerPageTitle
        sortBy={sortBy} setSortBy={setSortBy}
        category={category} setCategory={setCategory}
      />

    </div>
  );
}

const NewsManagerPageTitle = ({ sortBy, setSortBy, category, setCategory }) => {
  return (
    <div className="flex flex-row flex-wrap gap-4 justify-around">
      <div className="flex flex-row flex-wrap gap-4">
        <DropdownSelect title="Sắp xếp theo"
          labelMap={sortLabels} item={sortBy} setItem={setSortBy} />
        <DropdownSelect title="Danh mục"
          labelMap={categoryLabels} item={category} setItem={setCategory} />
      </div>
      <CreateNewsButton />
    </div>
  );
};
