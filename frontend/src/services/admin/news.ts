import { adminAxios } from "@/lib/axios/admin";
import { CreateNewsRequest, NewsType } from "../schemes/news";

const createNews = async (
  data: CreateNewsRequest
): Promise<NewsType> => {
  return (await adminAxios.post('/news', data)).data.data;
}

const deleteNews = async (news_id: number): Promise<void> => {
  return await adminAxios.delete(`/news/${news_id}`);
}

const updateNews = async (
  news_id: number, data: CreateNewsRequest
): Promise<NewsType> => {
  return (await adminAxios.put(`/news/${news_id}`, data)).data.data;
}

export const newsApiObject = {
  createNews: createNews,
  deleteNews: deleteNews,
  updateNews: updateNews
};
