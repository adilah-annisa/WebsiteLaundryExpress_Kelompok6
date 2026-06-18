import { useState } from "react";
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Outlet } from "react-router-dom";
import '../DashboardAdmin/assets/tailwind.css';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7fb] font-poppins">
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-auto">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
