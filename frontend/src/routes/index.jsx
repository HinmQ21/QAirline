import { createBrowserRouter } from "react-router-dom";

import { HomePage } from "../pages/HomePage";
import MainLayout from "../layouts/MainLayout";
import FlightsPage from "../pages/FlightsPage";
import SearchFlights from "../pages/SearchFlights";
import { SideBar } from "../components/layouts/SideBar";
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
    path: '/admin',
    element: <AdminLoginPage />
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboardPage />
  }
]);

export default router;