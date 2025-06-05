import { NewsCard } from "./NewsCard";
import { NewsType } from "@/services/schemes/news";
import { NewsCardSkeleton } from "./NewsCardSkeleton";

type NewsListProps = {
  isLoading: boolean;
  newsList: NewsType[];
  updateNewsStateAction: (news: NewsType) => void;
  deleteNewsStateAction: (news_id: number) => void;
}

export const NewsList = ({
  isLoading, newsList,
  updateNewsStateAction, deleteNewsStateAction
}: NewsListProps) => {
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
        newsList.map((e) => (
          <NewsCard key={e.news_id} news={e}
            updateNewsStateAction={updateNewsStateAction}
            deleteNewsStateAction={deleteNewsStateAction}
          />
        ))
      )
    }</div>
  );
}
