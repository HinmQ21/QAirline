import { User } from "../schemes/auth";
import { NewsCategoryType, NewsListResponse } from "../schemes/news";
import { ManufacturerType, PlaneType } from "../schemes/planes";

export interface ClientApiInterface {
  // Auth
  me: () => Promise<User>;

  // Flight
  // TODO: change `any` to a more specific type
  getFlightPaged: (pageSize: number, pageNumber: number) => Promise<any>;

  // News
  getNewsList: (params: {
    page: number;
    limit: number;
    category?: NewsCategoryType;
    search?: string;
  }) => Promise<NewsListResponse>;

  // Planes
  getPlaneList: (params: {
    manufacturer?: ManufacturerType;
  }) => Promise<PlaneType[]>;

  // Airports
  getAirportList: (params: {
    code: string,
    name: string,
    city: string,
    country: string,
  }) => Promise<any>;
}