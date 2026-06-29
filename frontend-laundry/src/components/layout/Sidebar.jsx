import { NavLink, useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import Footer from "../Footer";

export default function Sidebar({ open, onClose, brand, menuItems, accent = "blue" }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const accentActive = accent === "indigo"
    ? "bg-white text-indigo-700 shadow-md"
    : "bg-white text-blue-700 shadow-md";

  const navContent = (
    <>
      <div className="mb-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img src="/IconLaundry.png" alt="" className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1" />
          <div className="min-w-0">
            <h1 className="font-bold text-lg leading-tight truncate">Laundry Express</h1>
            <p className="text-xs text-white/70 truncate">{brand}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="md:hidden p-2 rounded-lg hover:bg-white/10" aria-label="Tutup">
          <IoClose className="text-xl" />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive ? accentActive : "text-white/85 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon className="text-xl shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/15 space-y-3">
        <p className="text-xs text-white/70 truncate px-1">{user?.name}</p>
        <button type="button" onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-white/90 hover:bg-white/10 transition-colors">
          <MdLogout className="text-lg" /> Keluar
        </button>
        <Footer />
      </div>
    </>
  );

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={onClose} aria-hidden="true" />}
      <aside
        className={`fixed md:sticky md:top-0 inset-y-0 left-0 z-50 h-screen w-64 shrink-0 bg-gradient-to-b from-blue-700 to-blue-900 flex flex-col p-5 text-white transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
