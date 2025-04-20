import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import FlightsPage from "../pages/FlightsPage";
import FakeHomePage from "../pages/FakeHomePage";
import SearchFlights from "../pages/SearchFlights";
import {HomePage} from "../pages/HomePage";
import { SideBar } from "../components/SideBar";
import { Search } from "lucide-react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FakeHomePage />
  },
  {
    path: "/home",
    element: <HomePage />
  },
  {
    path: "/sidebar",
    element: <SideBar />
  },
  {
    path: "/flights",
    element: <FlightsPage />
  },
  {
    path: "searchflights",
    element: <SearchFlights />
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