import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">
        <Outlet />
      </main>
    </div>
  );
}