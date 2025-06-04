import { adminAxios } from "@/lib/axios/admin";
import { NewsCategoryType, NewsListResponse } from "../schemes/news";

const getNewsList = async (params: {
  page: number;
  limit: number;
  category?: NewsCategoryType | undefined;
  search?: string | undefined;
}): Promise<NewsListResponse> => {
  return (await adminAxios.get('/news', { params })).data.data;
};

export const newsApiObject = {getNewsList: getNewsList};
