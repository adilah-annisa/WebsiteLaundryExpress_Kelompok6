import { useLocation } from 'react-router-dom';
import { IoNotificationsOutline } from "react-icons/io5";

const pageTitles = {
  '/': 'Dashboard',
  '/pesanan': 'Kelola Pesanan',
  '/jadwal': 'Slot Waktu Penjemputan',
  '/keuangan': 'Keuangan',
};

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="font-inter-semibold text-2xl text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500 mt-1 font-poppins">Selamat datang kembali, Admin</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <IoNotificationsOutline className="text-xl text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <img
            src="/public/iconAdmin.jpg"
            alt="Admin"
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
          />
          <div className="hidden md:block">
            <p className="text-sm font-inter-semibold text-gray-800">Admin</p>
            <p className="text-xs text-gray-500 font-poppins">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

