import { MdSpaceDashboard, MdOutlineSchedule, MdAttachMoney } from "react-icons/md";
import { GoListOrdered } from "react-icons/go";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();
    const menuItems = [
        { icon: MdSpaceDashboard, label: "Dashboard", path: "/" },
        { icon: GoListOrdered, label: "Pesanan", path: "/pesanan" },
        { icon: MdOutlineSchedule, label: "Jadwal", path: "/jadwal" },
        { icon: MdAttachMoney, label: "Keuangan", path: "/keuangan" },
    ];

    return (
        <aside className="min-h-screen w-[240px] bg-[#1565C0] flex flex-col p-6 text-white">
            {/* Logo */}
            <div className="mb-10 flex items-center gap-3">
                <img src="/IconLaundry.png" alt="Laundry Express" className="w-10 h-10 object-contain rounded-lg" />
                <div>
                    <h1 className="font-poppins-semibold text-xl leading-tight">Laundry Express</h1>
                    <p className="text-sm text-blue-100 opacity-80 mt-0.5">Admin Dashboard</p>
                </div>
            </div>

            {/* Menu */}
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
                                            : "text-white/90 hover:bg-white/10 hover:text-white"
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

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-white/20">
                <p className="text-xs text-blue-100 opacity-60 text-center">
                    © 2025 Laundry Express
                </p>
            </div>
        </aside>
    );
}

