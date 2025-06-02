import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { NewsList } from "@/components/admin/news-manager/NewsList";
import { getNewsList, NewsType, NewsCategoryType } from "@/services/admin/news";
import { NewsManagerPageTitle } from "@/components/admin/news-manager/NewsPageTitle";

export const NewsManagerPage = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [newsList, setNewsList] = useState<NewsType[]>([]);

  const createNewsStateAction = (news: NewsType) => {
    setNewsList([news, ...newsList]);
  }
  const updateNewsStateAction = (news: NewsType) => {
    setNewsList([news, ...newsList.filter((x) => x.news_id != news.news_id)]);
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
      <div className="h-10" />
      <NewsList isLoading={isLoading} newsList={newsList} deleteNewsStateAction={deleteNewsStateAction} />
    </div>
  );
}
