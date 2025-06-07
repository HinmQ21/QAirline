import { css } from "@/css/styles";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";

export default function MainLayout() {
  return (
    <div className={`flex flex-col ${css.homepageGgGradient} min-h-screen`}>
      <Header />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}