import { CreateNewsRequest, NewsType } from "../schemes/news";
import { CreatePlaneRequest, PlaneType } from "../schemes/planes";

export interface AdminApiInterface {
  // Auth
  me: () => Promise<any>;
  login: (username: string, password: string) => Promise<any>;

  // News
  createNews: (data: CreateNewsRequest) => Promise<NewsType>;
  deleteNews: (news_id: number) => Promise<void>;
  updateNews: (news_id: number, data: CreateNewsRequest) => Promise<NewsType>;

  // Planes
  createPlane: (data: CreatePlaneRequest) => Promise<PlaneType>;
  deletePlane: (plane_id: number) => Promise<any>;
  updatePlane: (plane_id: number, data: CreatePlaneRequest) => Promise<PlaneType>;
}
