import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import FlightsPage from "../pages/FlightsPage";
import SearchFlights from "../pages/SearchFlights";
import {HomePage} from "../pages/HomePage";
import { SideBar } from "../components/SideBar";
import { Search } from "lucide-react";
import { WeatherDisplay } from "../components/Weather";
import ShadcnCommonComponents from "../components/ShadcnCommonComponents";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/sidebar",
    element: <SideBar />
  },
  {
    path: "/flights",
    element: <MainLayout />,
      children: [
        { path: "", element: <FlightsPage /> },
      ],
  },
  {
    path: "/searchflights",
    element: <MainLayout />,
      children: [
        { path: "", element: <SearchFlights /> },
      ],
  },
  {
    path: '/shadcn-test',
    element: <ShadcnCommonComponents />
  }
  // {
  //   path: "/",
  //   element: <MainLayout />,
  //   children: [
  //     { path: "", element: <FakeHomePage /> },
  //     { path: "flights", element: <FlightsPage /> },
  //     { path: "sidebar", element: <SideBar /> }
  //   ],
  // },
  // {
  //   path: "/admin",
  //   element: <AdminLayout />,
  //   children: [  
  //     { path: "", element: <AdminDashboard /> },
  //   ],
  // },
]);

export default router;