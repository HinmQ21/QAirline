import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { clientApi } from "@/services/client/main";
import { NewsType } from "@/services/schemes/news";
import { NewsCategoryType } from "@/services/schemes/news";
import { NewsList } from "@/components/admin/news-manager/NewsList";
import { NewsManagerPageTitle } from "@/components/admin/news-manager/PageTitle";
import { Card } from "@/components/ui/card";
import { PenTool, TrendingUp, Eye, Clock } from "lucide-react";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";

export const NewsManagerPage = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [newsList, setNewsList] = useState<NewsType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(9); // 3x3 grid

  const createNewsStateAction = (news: NewsType) => {
    setNewsList([news, ...newsList]);
    setTotalItems(prev => prev + 1);
  }
  
  const updateNewsStateAction = (news: NewsType) => {
    setNewsList(newsList.map((x) => (x.news_id == news.news_id) ? news : x));
  }
  
  const deleteNewsStateAction = (news_id: number) => {
    setNewsList(newsList.filter(n => n.news_id !== news_id));
    setTotalItems(prev => prev - 1);
  }

  const fetchNews = async (page: number = 1, selectedCategory: string = "all") => {
    setIsLoading(true);
    try {
      let _category = selectedCategory === "all" ? undefined : selectedCategory as NewsCategoryType;
      const response = await clientApi.getNewsList({ 
        page, 
        limit: itemsPerPage, 
        category: _category 
      });
      
      console.log(response);
      setNewsList(response.news);
      setTotalItems(response.total || response.news.length);
      setTotalPages(Math.ceil((response.total || response.news.length) / itemsPerPage));
      setIsLoading(false);
    } catch (err: any) {
      let errMsg;
      try { errMsg = err.response.data.message; }
      catch { errMsg = err.toString(); }
      toast.error(errMsg);
      setIsLoading(false);
    }
  };

  // Fetch news whenever currentPage or category changes
  useEffect(() => {
    fetchNews(currentPage, category);
  }, [currentPage, category]);

  // Reset to page 1 when category changes (but don't trigger double fetch)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [category]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Update stats calculation based on total items
  const stats = [
    {
      title: "Tổng bài viết",
      value: totalItems.toString(),
      icon: PenTool,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Phổ biến nhất",
      value: "1.2K",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Lượt xem hôm nay",
      value: "3.4K",
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Quản lý Tin tức</h1>
        <p className="text-blue-100">Tạo, chỉnh sửa và quản lý tất cả tin tức của QAirline</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Controls Section */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-md">
        <NewsManagerPageTitle
          sortBy={sortBy} setSortBy={setSortBy}
          category={category} setCategory={setCategory}
          createNewsStateAction={createNewsStateAction}
        />
      </Card>

      {/* Pagination Info */}
      {!isLoading && totalItems > 0 && (
        <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md">
          <div className="flex items-center justify-between">
            <PaginationInfo
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
            <div className="text-sm text-gray-500">
              {itemsPerPage} tin tức mỗi trang
            </div>
          </div>
        </Card>
      )}

      {/* News List Section */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-md">
        <NewsList isLoading={isLoading} newsList={newsList}
          updateNewsStateAction={updateNewsStateAction}
          deleteNewsStateAction={deleteNewsStateAction} />
      </Card>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="justify-center"
          />
        </Card>
      )}
    </div>
  );
}
