import { adminApi } from "@/lib/axios/admin";
import { NewsCategoryType, NewsListResponse } from "../schemes/news";


export const getNewsList = async (params: {
  page: number;
  limit: number;
  category?: NewsCategoryType | undefined;
  search?: string | undefined;
}): Promise<NewsListResponse> => {
  return (await adminApi.get('/news', { params })).data.data;
};
