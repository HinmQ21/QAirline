import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import FlightsPage from "../pages/FlightsPage";
import FakeHomePage from "../pages/FakeHomePage";
import {HomePage} from "../pages/HomePage";
import { SideBar } from "../components/SideBar";

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