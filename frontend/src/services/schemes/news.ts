export const newsCategoryLabels = {
  introduction: "Giới thiệu",
  promotion: "Khuyến mãi",
  news: "Tin tức",
  announcement: "Thông báo"
};export const newsCategoryList = ["news", "announcement", "introduction", "promotion"] as const;
export type NewsCategoryType = (typeof newsCategoryList)[number];
export type NewsType = {
  admin: {
    full_name: string;
    username: string;
  };
  category: NewsCategoryType;
  news_id: number;
  content: string;
  created_at: string;
  created_by: number;
  title: string;
};
export type CreateNewsRequest = {
  title: string; content: string;
  category: NewsCategoryType;
};
export type NewsListResponse = {
  news: NewsType[]; total: number;
  page: number; limit: number;
};

