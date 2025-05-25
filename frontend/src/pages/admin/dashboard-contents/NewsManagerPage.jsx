import { useState } from "react";
import { CreateNewsButton } from "@/components/admin/news-manager/create-news";
import { newsCategoryLabels } from "@/services/admin/news";
import { DropdownSelect } from "@/components/misc/DropdownSelect";
import { NewsList } from "@/components/admin/news-manager/news-list";

const sortLabels = {
  newest: "Mới nhất",
  "most-popular": "Phổ biến nhất",
  oldest: "Cũ nhất",
};

const allCategoryLabels = {
  all: "Tất cả",
  ...newsCategoryLabels
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
      <NewsList />
    </div>
  );
}

const NewsManagerPageTitle = ({ sortBy, setSortBy, category, setCategory }) => {
  return (
    <div className="flex flex-row flex-wrap gap-4 justify-around">
      <div className="flex flex-row flex-wrap gap-4">
        <DropdownSelect title="Sắp xếp theo"
          labelMap={sortLabels} value={sortBy} setValue={setSortBy} />
        <DropdownSelect title="Danh mục"
          labelMap={allCategoryLabels} value={category} setValue={setCategory} />
      </div>
      <CreateNewsButton />
    </div>
  );
};
