import { createBrowserRouter } from "react-router-dom";

import { HomePage } from "../pages/HomePage";
import MainLayout from "../layouts/MainLayout";
import FlightsPage from "../pages/FlightsPage";
import { BookAvailability } from "../pages/BookAvailability";
import DestinationsPage from "../pages/Destination";
import { NewsPage } from "../pages/NewsPage";
import { SideBar } from "../components/layouts/SideBar";
import { AdminLoginPage } from "../pages/admin/LoginPage";
import { AdminDashboardPage } from "@/pages/admin/DashboardPage";
import BookingPage from "../pages/BookingPage";
import MyBookingsPage from "../pages/MyBookingsPage";

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
    path: "/booking/:flightId",
    element: <MainLayout />,
    children: [
      { path: "", element: <BookingPage /> },
    ],
  },
  {
    path: "/bookings",
    element: <MainLayout />,
    children: [
      { path: "", element: <MyBookingsPage /> },
    ],
  },
  {
    path: "/destinations",
    element: <MainLayout />,
    children: [
      { path: "", element: <DestinationsPage /> },
    ],
  },
  {
    path: "/news",
    element: <MainLayout />,
    children: [
      { path: "", element: <NewsPage /> },
    ],
  },
  {
    path: "/book/availability",
    element: <MainLayout />,
    children: [
      { path: "", element: <BookAvailability/> },
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