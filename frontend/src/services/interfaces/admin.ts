import { CreateNewsRequest, NewsType } from "../schemes/news";
import { CreatePlaneRequest, PlaneType } from "../schemes/planes";

export interface AdminApiInterface {
  // Auth
  me: () => Promise<any>;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;

  // News
  createNews: (data: CreateNewsRequest) => Promise<NewsType>;
  deleteNews: (news_id: number) => Promise<void>;
  updateNews: (news_id: number, data: CreateNewsRequest) => Promise<NewsType>;

  // Planes
  createPlane: (data: CreatePlaneRequest) => Promise<PlaneType>;
  deletePlane: (plane_id: number) => Promise<any>;
  updatePlane: (plane_id: number, data: CreatePlaneRequest) => Promise<PlaneType>;
  
  // Seat configuration
  getAirplaneSeats: (plane_id: number) => Promise<any>;
  configureSeatLayout: (plane_id: number, data: {
    row?: number;
    start_row?: number;
    end_row?: number;
    num_seats_per_row: number;
    class: 'economy' | 'business' | 'first';
  }) => Promise<any>;
  updateSeatsByRow: (plane_id: number, data: {
    row?: number;
    start_row?: number;
    end_row?: number;
    num_seats_per_row?: number;
    class?: 'economy' | 'business' | 'first';
  }) => Promise<any>;
  deleteSeatsByRow: (plane_id: number, data: {
    row?: number;
    start_row?: number;
    end_row?: number;
  }) => Promise<any>;
}
