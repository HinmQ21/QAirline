import toast from "react-hot-toast";
import { DropdownSelect } from "@/components/misc/DropdownSelect";
import { NewsList } from "@/components/admin/news-manager/NewsList";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { getNewsList, newsCategoryLabels, NewsType, NewsCategoryType } from "@/services/admin/news";
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
  const [isLoading, setIsLoading] = useState(true);
  const [newsList, setNewsList] = useState<NewsType[]>([]);

  const createNewsStateAction = (news: NewsType) => {
    setNewsList([news, ...newsList]);
  }
  const deleteNewsStateAction = (news_id: number) => {
    setNewsList(newsList.filter(n => n.news_id !== news_id));
  }

  useEffect(() => { setIsLoading(true); }, [category]);
  useEffect(() => {
    if (isLoading === false) return;
    let _category = category === "all" ? undefined : category as NewsCategoryType;
    getNewsList({ page: 1, limit: 10, category: _category })
    .then(
      (response) => {
        console.log(response);
        setNewsList(response.news);
        setIsLoading(false);
      }
    )
    .catch(
      (err) => {
        let errMsg;
        try { errMsg = err.response.data.message; }
        catch { errMsg = err.toString(); }
        toast.error(errMsg);
        setIsLoading(false);
      }
    );
  }, [isLoading]);

  return (
    <div className="w-full">
      <NewsManagerPageTitle
        sortBy={sortBy} setSortBy={setSortBy}
        category={category} setCategory={setCategory}
        createNewsStateAction={createNewsStateAction}
      />
      <div className="h-10"></div>
      <NewsList isLoading={isLoading} newsList={newsList} deleteNewsStateAction={deleteNewsStateAction} />
    </div>
  );
}

type NewsManagerPageTitleProps = {
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  createNewsStateAction: (news: NewsType) => void;
};

const NewsManagerPageTitle = ({ sortBy, setSortBy, category, setCategory, createNewsStateAction }: NewsManagerPageTitleProps) => {
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
