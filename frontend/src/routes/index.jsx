import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import FlightsPage from "../pages/FlightsPage";
import SearchFlights from "../pages/SearchFlights";
import { HomePage } from "../pages/HomePage";
import { SideBar } from "../components/layouts/SideBar";
import { Search } from "lucide-react";
import { WeatherDisplay } from "../components/layouts/Weather";
import ShadcnCommonComponents from "../components/misc/ShadcnCommonComponents";
import { AdminLoginPage } from "../pages/admin/LoginPage";
import { AdminDashboardPage } from "@/pages/admin/DashboardPage";

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
    path: '/test',
    element: <ShadcnCommonComponents />
  },
  {
    path: '/admin',
    element: <AdminLoginPage />
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboardPage />
  }
]);

export default router;