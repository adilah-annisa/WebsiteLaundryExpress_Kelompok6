import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./assets/tailwind.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "../pages/admin/Dashboard";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <div className="min-h-screen bg-[#f5f7fb] font-poppins">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-8 overflow-auto">
          <Header />
          <Dashboard />
        </main>
      </div>
    </div>
  </BrowserRouter>
);