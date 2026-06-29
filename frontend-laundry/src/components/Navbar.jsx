import { useState, useEffect } from "react";
import { IoNotificationsOutline, IoMenuOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import notifications from "../data/Notifications.json";
import Badge from "./ui/Badge";

const roleLabels = { admin: "Pemilik Laundry", pelanggan: "Pelanggan", kurir: "Kurir" };

export default function Navbar({ title, subtitle, onMenuClick }) {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!dropdownOpen) return;
    const close = () => setDropdownOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [dropdownOpen]);

  return (
    <header className="sticky top-0 z-30 -mx-4 px-4 py-3 mb-6 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/60">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {onMenuClick && (
            <button type="button" onClick={onMenuClick} className="md:hidden p-2 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50" aria-label="Menu">
              <IoMenuOutline className="text-xl text-slate-700" />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold text-slate-900 truncate tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs md:text-sm text-slate-500 truncate">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setDropdownOpen((p) => !p); }}
              className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm"
            >
              <IoNotificationsOutline className="text-xl text-slate-600" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unread}</span>
              )}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50" onClick={(e) => e.stopPropagation()}>
                <p className="px-4 py-2 text-xs font-bold text-slate-500 uppercase">Notifikasi</p>
                {notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                      {!n.read && <Badge variant="primary">Baru</Badge>}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-slate-200">
            <img src="/iconAdmin.jpg" alt="" className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover" />
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name}</p>
              <p className="text-xs text-slate-500">{roleLabels[user?.role]}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
