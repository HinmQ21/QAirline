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
    full_name: string,
    username: string,
  },
  category: NewsCategoryType,
  content: string,
  created_at: string,
  created_by: number,
  news_id: number,
  title: string
};

export const createNews = async (data: {
  title: string;
  content: string;
  category: NewsCategoryType
}) => {
  return await adminApi.post('/news', data);
}

export const getNewsList = async (params: {
  page: number,
  limit: number,
  category?: NewsCategoryType | undefined,
  search?: string | undefined
}) => {
  return await adminApi.get('/news', {params});
}
