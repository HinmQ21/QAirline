import { createBrowserRouter } from "react-router-dom";

import { TestPage } from "@/pages/TestPage";
import { HomePage } from "../pages/HomePage";
import MainLayout from "../layouts/MainLayout";
import FlightsPage from "../pages/FlightsPage";
import DestinationsPage from "../pages/Destination";
import { NewsPage } from "../pages/NewsPage";
import { SideBar } from "../components/layouts/SideBar";
import { AdminLoginPage } from "../pages/admin/LoginPage";
import { BookAvailability } from "../pages/BookAvailability";
import { AdminDashboardPage } from "@/pages/admin/DashboardPage";
import BookingPage from "../pages/BookingPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import ProfilePage from "../pages/ProfilePage";
import { AdminProvider } from "@/context/AdminContext";
import { AdminRouteGuard } from "@/components/admin/AdminRouteGuard";

// Admin Layout wrapper with AdminProvider
const AdminLayout = ({ children }) => {
  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  );
};

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
    path: "/profile",
    element: <MainLayout />,
    children: [
      { path: "", element: <ProfilePage /> },
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
      { path: "", element: <BookAvailability /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout><AdminLoginPage /></AdminLayout>
  },
  {
    path: '/admin/login',
    element: <AdminLayout><AdminLoginPage /></AdminLayout>
  },
  {
    path: '/admin/dashboard',
    element: <AdminLayout><AdminRouteGuard><AdminDashboardPage /></AdminRouteGuard></AdminLayout>
  },
  {
    path: '/test',
    element: <TestPage />
  }
]);

export default router;