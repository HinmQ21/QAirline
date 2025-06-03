import { DropdownSelect } from "@/components/misc/DropdownSelect";
import { NewsType } from "@/services/schemes/news";
import { newsCategoryLabels } from "@/services/schemes/news";
import { Dispatch, SetStateAction } from "react";
import { CreateNewsButton } from "./CreateNewsButton";

const sortLabels = {
  newest: "Mới nhất",
  "most-popular": "Phổ biến nhất",
  oldest: "Cũ nhất",
};

const allCategoryLabels = {
  all: "Tất cả",
  ...newsCategoryLabels
};

type NewsManagerPageTitleProps = {
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  createNewsStateAction: (news: NewsType) => void;
};

export const NewsManagerPageTitle = ({ sortBy, setSortBy, category, setCategory, createNewsStateAction }: NewsManagerPageTitleProps) => {
  return (
    <div className="flex flex-row flex-wrap gap-4 justify-around">
      <div className="flex flex-row flex-wrap gap-4">
        <DropdownSelect title="Sắp xếp theo"
          labelMap={sortLabels} value={sortBy} setValue={setSortBy} />
        <DropdownSelect title="Danh mục"
          labelMap={allCategoryLabels} value={category} setValue={setCategory} />
      </div>
      <CreateNewsButton createNewsStateAction={createNewsStateAction} />
    </div>
  );
};