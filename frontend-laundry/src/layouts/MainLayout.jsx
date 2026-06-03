import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Outlet } from "react-router-dom";
import '../DashboardAdmin/assets/tailwind.css';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] font-poppins">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <Header />
          <Outlet/>
        </main>
      </div>
    </div>
  );
}

