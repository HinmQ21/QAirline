import { adminApi } from "@/lib/axios/admin";

type NewsCategoryType = "news" | "announcement" | "introduction" | "promotion";

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
  category: NewsCategoryType,
  search?: string | undefined
}) => {
  return await adminApi.get('/news', {params});
}
