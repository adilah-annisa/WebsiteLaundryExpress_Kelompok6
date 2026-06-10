import { Outlet } from "react-router-dom";
import SidebarKurir from "../components/SidebarKurir";
import Header from "../components/Header";

export default function KurirLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarKurir />

      <main className="flex-1">
        <Header
          title="Dashboard Kurir"
          subtitle="Selamat datang kembali, Kurir"
          role="Kurir"
          desc="Delivery Staff"
        />

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
