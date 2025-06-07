import { NewsCard } from "./NewsCard";
import { NewsType } from "@/services/schemes/news";
import { NewsCardSkeleton } from "./NewsCardSkeleton";
import { FileText, Search } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy tin tức</h3>
        <p className="text-gray-500 max-w-md">
          Không có tin tức nào phù hợp với bộ lọc hiện tại. Hãy thử thay đổi điều kiện tìm kiếm hoặc tạo tin tức mới.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      {!isLoading && newsList.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600 font-medium">
              {newsList.length} tin tức trên trang này
            </span>
          </div>
        </div>
      )}

      {/* Grid Layout - 3x3 for pagination */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          // Show 9 skeletons for 3x3 grid
          Array(9).fill(0).map((_, i) => <NewsCardSkeleton key={i} />)
        ) : (
          newsList.map((news) => (
            <NewsCard 
              key={news.news_id} 
              news={news}
              updateNewsStateAction={updateNewsStateAction}
              deleteNewsStateAction={deleteNewsStateAction}
            />
          ))
        )}
      </div>
    </div>
  );
}
