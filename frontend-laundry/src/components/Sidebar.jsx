import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdSpaceDashboard, MdOutlineSchedule, MdAttachMoney, MdBarChart, MdPersonOutline, MdLogout } from "react-icons/md";
import { GoListOrdered } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ open = false, onClose }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const menuItems = [
        { icon: MdSpaceDashboard, label: "Dashboard", path: "/dashboard" },
        { icon: GoListOrdered, label: "Pesanan", path: "/dashboard/pesanan" },
        { icon: MdOutlineSchedule, label: "Jadwal", path: "/dashboard/jadwal" },
        { icon: MdAttachMoney, label: "Keuangan", path: "/dashboard/keuangan" },
    ];

    useEffect(() => {
        onClose?.();
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navContent = (
        <>
            <div className="mb-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <img src="/IconLaundry.png" alt="Laundry Express" className="w-10 h-10 object-contain rounded-lg" />
                    <div>
                        <h1 className="font-poppins-semibold text-xl leading-tight">Laundry Express</h1>
                        <p className="text-sm text-blue-100 opacity-80 mt-0.5">Admin Dashboard</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Tutup menu"
                >
                    <IoClose className="text-xl" />
                </button>
            </div>

            <nav className="flex-1">
                <ul className="space-y-2">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-inter-medium text-sm ${
                                        isActive
                                            ? "bg-white text-[#1565C0] font-inter-semibold shadow-lg"
                                            : "text-white/90 hover:bg-white/10 hover:text-white hover:translate-x-0.5"
                                    }`}
                                >
                                    <Icon className="text-xl" />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="mt-auto pt-6 border-t border-white/20 space-y-3">
                <p className="text-xs text-blue-100 opacity-80 truncate">{user?.name}</p>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm text-white/90 hover:bg-white/10 transition-colors"
                >
                    <MdLogout className="text-lg" />
                    Keluar
                </button>
                <p className="text-xs text-blue-100 opacity-60 text-center">© 2025 Laundry Express</p>
            </div>
        </>
    );

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed md:static inset-y-0 left-0 z-50 min-h-screen w-60 bg-[#1565C0] flex flex-col p-6 text-white transform transition-transform duration-300 ease-in-out ${
                    open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}
            >
                {navContent}
            </aside>
        </>
    );
}
