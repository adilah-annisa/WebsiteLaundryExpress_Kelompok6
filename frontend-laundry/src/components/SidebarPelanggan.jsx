import { MdSpaceDashboard, MdOutlineSchedule } from "react-icons/md";
import { GoListOrdered } from "react-icons/go";
import { FaHistory } from "react-icons/fa";
import { IoReceiptOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";

export default function SidebarPelanggan() {
    const location = useLocation();

    const menuItems = [
        { icon: MdSpaceDashboard, label: "Dashboard", path: "/pelanggan" },
        { icon: GoListOrdered, label: "Pesan Laundry", path: "/pelanggan/pesanan" },
        { icon: MdOutlineSchedule, label: "Jadwal Jemput", path: "/pelanggan/jadwal" },
        { icon: FaHistory, label: "Riwayat", path: "/pelanggan/riwayat" },
        { icon: IoReceiptOutline, label: "Bukti Antar", path: "/pelanggan/bukti" },
    ];

    return (
        <aside className="min-h-screen w-[240px] bg-[#1565C0] flex flex-col p-6 text-white">
            <div className="mb-10 flex items-center gap-3">
                <img
                    src="/IconLaundry.png"
                    alt="Laundry Express"
                    className="w-10 h-10 object-contain rounded-lg"
                />

                <div>
                    <h1 className="font-poppins-semibold text-xl leading-tight">
                        Laundry Express
                    </h1>
                    <p className="text-sm text-blue-100 opacity-80 mt-0.5">
                        Pelanggan Dashboard
                    </p>
                </div>
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
                                                    ? "bg-white text-[#1565C0] font-inter-semibold shadow-lg border-l-4 border-white"
                                                    : "text-white/90 hover:bg-white/10 hover:text-white"
                                            }`}
                                        >
                                            <span className={`w-9 h-9 rounded-md flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-white/5'} transition-colors`}>
                                                <Icon className="text-lg" />
                                            </span>
                                            <span className="truncate">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
            </nav>

            <div className="mt-auto pt-6 border-t border-white/20">
                <p className="text-xs text-blue-100 opacity-60 text-center">
                    © 2025 Laundry Express
                </p>
            </div>
        </aside>
    );
}