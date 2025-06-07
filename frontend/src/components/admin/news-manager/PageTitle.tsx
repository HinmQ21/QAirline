import { DropdownSelect } from "@/components/misc/DropdownSelect";
import { NewsType } from "@/services/schemes/news";
import { newsCategoryLabels } from "@/services/schemes/news";
import { Dispatch, SetStateAction } from "react";
import { CreateNewsButton } from "./CreateNewsButton";
import { Filter, SortAsc } from "lucide-react";

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
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Danh sách tin tức</h2>
        <CreateNewsButton createNewsStateAction={createNewsStateAction} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-gray-500" />
          <DropdownSelect 
            title="Sắp xếp theo"
            labelMap={sortLabels} 
            value={sortBy} 
            setValue={setSortBy} 
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <DropdownSelect 
            title="Danh mục"
            labelMap={allCategoryLabels} 
            value={category} 
            setValue={setCategory} 
          />
        </div>
      </div>
    </div>
  );
};