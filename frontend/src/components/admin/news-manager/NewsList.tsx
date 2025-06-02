import { Badge } from "@/components/ui/badge";
import { NewsCard, NewsCardSkeleton } from "./NewsCard";
import { newsCategoryLabels, NewsCategoryType, NewsType } from "@/services/admin/news";

export const NewsCategoryBadge = ({ category }: { category: NewsCategoryType }) => {
  let className;
  switch (category) {
    case "news": className = "bg-slate-500 hover:bg-slate-400"; break;
    case "announcement": className = "bg-red-500 hover:bg-red-400"; break;
    case "introduction": className = "bg-cyan-600 hover:bg-cyan-500"; break;
    case "promotion": className = "bg-orange-500 hover:bg-orange-400"; break;
  }
  return <Badge className={`${className}`}>{newsCategoryLabels[category]}</Badge>
}

type NewsListProps = {
  isLoading: boolean;
  newsList: NewsType[];
  deleteNewsStateAction: (news_id: number) => void;
}

export const NewsList = ({ isLoading, newsList, deleteNewsStateAction }: NewsListProps) => {
  if (isLoading === false && newsList.length === 0) {
    return (
      <p className="text-center text-2xl text-gray-900">
        Our search engine is superlative, but no result apparently!
      </p>
    );
  }

  return (
    <div className="flex flex-row flex-wrap justify-center gap-4">{
      isLoading ? (
        Array(8).fill(0).map((_, i) => <NewsCardSkeleton key={i} />)
      ) : (
        newsList.map((e) => <NewsCard key={e.news_id} news={e} deleteNewsStateAction={deleteNewsStateAction} />)
      )
    }</div>
  );
}
