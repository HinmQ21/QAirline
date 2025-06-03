import { adminApi } from "@/lib/axios/admin";

export const newsCategoryLabels = {
  introduction: "Giới thiệu",
  promotion: "Khuyến mãi",
  news: "Tin tức",
  announcement: "Thông báo"
};

export const newsCategoryList = ["news", "announcement", "introduction", "promotion"] as const;
export type NewsCategoryType = typeof newsCategoryList[number];

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
}

export const createNews = async (
  data: CreateNewsRequest
): Promise<NewsType> => {
  return (await adminApi.post('/news', data)).data.data;
}

export type NewsListResponse = {
  news: NewsType[]; total: number;
  page: number; limit: number;
};

export const getNewsList = async (params: {
  page: number,
  limit: number,
  category?: NewsCategoryType | undefined,
  search?: string | undefined
}): Promise<NewsListResponse> => {
  return (await adminApi.get('/news', { params })).data.data;
}

export const deleteNews = async (news_id: number) => {
  return await adminApi.delete(`/news/${news_id}`);
}

export const updateNews = async (
  news_id: number, data: CreateNewsRequest
): Promise<NewsType> => {
  return (await adminApi.put(`/news/${news_id}`, data)).data.data;
}
