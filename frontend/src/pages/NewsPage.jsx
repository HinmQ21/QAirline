import { useState, useEffect } from "react";
import { clientApi } from "@/services/client/main";
import { css } from "@/css/styles";
import { Search, Calendar, Filter, ChevronRight, Clock } from "lucide-react";
import { NewsCategoryBadge } from "@/components/admin/news-manager/NewsCard";
import { NewsDialog } from "@/components/misc/NewsDialog";

export const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [total, setTotal] = useState(0);

  const categories = [
    { value: "", label: "Tất cả" },
    { value: "introduction", label: "Giới thiệu" },
    { value: "promotion", label: "Khuyến mãi" },
    { value: "announcement", label: "Thông báo" },
    { value: "news", label: "Tin tức" }
  ];

  const fetchNews = async (page = 1, category = "", search = "") => {
    try {
      setLoading(true);
      const params = {
        page: page,
        limit: 10,
      };

      if (category) params.category = category;
      if (search) params.search = search;

      const response = await clientApi.getNewsList(params);

      setNews(response.news);
      setTotalPages(Math.ceil(response.total / response.limit));
      setTotal(response.total);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(currentPage, selectedCategory, searchTerm);
  }, [currentPage, selectedCategory, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNews(1, selectedCategory, searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      introduction: "bg-blue-100 text-blue-800",
      promotion: "bg-green-100 text-green-800",
      announcement: "bg-yellow-100 text-yellow-800",
      news: "bg-purple-100 text-purple-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getCategoryLabel = (category) => {
    const labels = {
      introduction: "Giới thiệu",
      promotion: "Khuyến mãi",
      announcement: "Thông báo",
      news: "Tin tức"
    };
    return labels[category] || "Khác";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${css.homepageGgGradient}`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Tin tức & <span className="text-pink-300">Thông báo</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Cập nhật những thông tin mới nhất về chuyến bay, khuyến mãi và dịch vụ của QAirline
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{total}+</div>
                <div className="text-gray-200 text-sm">Tin tức</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-gray-200 text-sm">Cập nhật</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4</div>
                <div className="text-gray-200 text-sm">Danh mục</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Mới</div>
                <div className="text-gray-200 text-sm">Hàng ngày</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <div className={`${css.minipagemx} relative z-20`}>
        <div className="mx-4 lg:mx-8 xl:mx-16 my-10">
          {/* Search and Filter */}
          <div className={`${css.minipage.xl} p-8 pb-5 mb-8`}>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm tin tức..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50"
                  />
                </div>
              </form>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => handleCategoryChange(category.value)}
                    className={`px-4 py-3 rounded-xl reddit-medium
                      transition-all duration-200
                      ${selectedCategory === category.value
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-400"
                      }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

            </div>
            <p className="text-gray-600 reddit-medium mt-2">
              Hiển thị {news.length} trong tổng số {total} tin tức
            </p>
          </div>

          {/* Results Info */}
          {/* <div className="mb-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">

          </div> */}

          {/* News List */}
          {loading ? (
            <div className="grid gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className={`${css.minipage.xl} animate-pulse`}>
                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="flex-1">
                        {/* Category Badge Skeleton */}
                        <div className="mb-4">
                          <div className="w-24 h-6 bg-gray-200 rounded-full"></div>
                        </div>

                        {/* Title Skeleton */}
                        <div className="h-8 bg-gray-200 rounded-lg mb-4 w-3/4"></div>

                        {/* Content Preview Skeleton */}
                        <div className="space-y-3 mb-6">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>

                        {/* Meta Info Skeleton */}
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                            <div className="w-32 h-4 bg-gray-200 rounded"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-4 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>

                      {/* Arrow Skeleton */}
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {news.map((article) => (
                <NewsDialog key={article.news_id} news={article}>
                  <article className={`group ${css.minipage.xl} transition-all duration-300 overflow-hidden hover:-translate-y-1 cursor-pointer`}>
                    <div className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="flex-1 text-left">
                          {/* Category Badge */}
                          <div className="mb-4 flex justify-start">
                            <NewsCategoryBadge category={article.category} size="large" />
                          </div>

                          {/* Title */}
                          <h2 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors text-left">
                            {article.title}
                          </h2>

                          {/* Content Preview */}
                          <p className="text-gray-600 mb-6 line-clamp-3 text-lg leading-relaxed text-left">
                            {article.content.replace(/<[^>]*>/g, '').slice(0, 200)}...
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium">{formatDate(article.created_at)}</span>
                            </div>
                            {article.admin && (
                              <div className="flex items-center gap-2">
                                <span>Đăng bởi: <span className="font-medium text-gray-700 ml-3">{article.admin.full_name}</span></span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Read More Arrow */}
                        <div className="flex-shrink-0">
                          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </article>
                </NewsDialog>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && news.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 text-xl mb-4 font-semibold">
                  Không tìm thấy tin tức nào
                </div>
                <p className="text-gray-500 text-lg">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex gap-3 bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-3 bg-gray-100 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                >
                  Trước
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${currentPage === page
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 bg-gray-100 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 