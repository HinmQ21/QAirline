import toast from "react-hot-toast";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { DropdownSelect } from "@/components/misc/DropdownSelect";
import { NewsList } from "@/components/admin/news-manager/NewsList";
import { getNewsList, newsCategoryLabels, NewsType } from "@/services/admin/news";
import { CreateNewsButton } from "@/components/admin/news-manager/CreateNewsButton";

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
  const [loading, setLoading] = useState(true);
  const [newsList, setNewsList] = useState<NewsType[]>([]);

  useEffect(() => {
    if (loading == false) return;
    getNewsList(
      { page: 1, limit: 10 }
    ).then(
      (response) => {
        console.log(response);
        setNewsList(response.news);
        setLoading(false);
      }
    ).catch(
      (err) => {
        let errMsg;
        try {
          errMsg = err.response.data.message;
        }
        catch {
          errMsg = err.toString();
        }
        toast.error(errMsg);
        setLoading(false);
      }
    );
  }, [loading]);

  return (
    <div className="w-full">
      <NewsManagerPageTitle
        sortBy={sortBy} setSortBy={setSortBy}
        category={category} setCategory={setCategory}
        setLoading={setLoading}
      />
      <NewsList data={newsList} />
    </div>
  );
}

type NewsManagerPageTitleProps = {
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  setLoading: Dispatch<SetStateAction<boolean>>
};

const NewsManagerPageTitle = ({ sortBy, setSortBy, category, setCategory, setLoading }: NewsManagerPageTitleProps) => {
  return (
    <div className="flex flex-row flex-wrap gap-4 justify-around">
      <div className="flex flex-row flex-wrap gap-4">
        <DropdownSelect title="Sắp xếp theo"
          labelMap={sortLabels} value={sortBy} setValue={setSortBy} />
        <DropdownSelect title="Danh mục"
          labelMap={allCategoryLabels} value={category} setValue={setCategory} />
      </div>
      <CreateNewsButton setLoading={setLoading}/>
    </div>
  );
};
