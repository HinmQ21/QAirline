import { adminApi } from "@/lib/axios/admin";
import { CreateNewsRequest, NewsType } from "../schemes/news";

export const createNews = async (
  data: CreateNewsRequest
): Promise<NewsType> => {
  return (await adminApi.post('/news', data)).data.data;
}

export const deleteNews = async (news_id: number) => {
  return await adminApi.delete(`/news/${news_id}`);
}

export const updateNews = async (
  news_id: number, data: CreateNewsRequest
): Promise<NewsType> => {
  return (await adminApi.put(`/news/${news_id}`, data)).data.data;
}
