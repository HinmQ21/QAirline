import { useState } from "react";
import { MiniPage, MiniPageH } from "../components/MiniPage";

export const AdminLoginPage = () => {
  return (
    <div
      className="min-h-screen min-w-screen bg-cover"
      style={{ backgroundImage: "url('/miscs/admin-bg.jpg')" }}
    >
      <div className="flex justify-center items-center h-screen">
        <MiniPage>
          <div className="flex flex-col items-center m-15">
            <p className="inter-bold text-2xl">Login as Admin</p>
          </div>
        </MiniPage>
      </div>
    </div>
  );
}