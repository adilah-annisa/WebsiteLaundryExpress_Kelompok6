import {
  IoShirtOutline,
  IoCubeOutline,
  IoTimeOutline,
  IoCloseCircleOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import dashboardData from "../../data/dashboardData.json";
import StatusBadge from "../../DashboardAdmin/components/StatusBadge";
import { Link } from "react-router-dom";

const iconMap = {
  IoShirtOutline,
  IoCubeOutline,
  IoTimeOutline,
  IoCloseCircleOutline,
};

export default function Dashboard() {
  const { stats, orders } = dashboardData;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-linear-to-r from-[#1565C0] to-[#3b6fd8] p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-blue-100 text-sm font-poppins">SAJAK EL — Sistem Antar-Jemput Laundry</p>
            <h2 className="font-inter-semibold text-2xl mt-1">Selamat datang, Admin!</h2>
            <p className="text-blue-100 text-sm mt-2 font-poppins">Pantau pesanan, jadwal, dan keuangan laundry Anda hari ini.</p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
            <IoTrendingUpOutline className="text-2xl" />
            <div>
              <p className="text-xs text-blue-100">Pertumbuhan bulan ini</p>
              <p className="font-inter-semibold text-lg">+12%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.iconName];
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div
                className={`w-14 h-14 rounded-xl ${stat.bgIcon} flex items-center justify-center`}
              >
                <Icon className="text-2xl" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="font-inter-semibold text-2xl text-gray-800">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 font-poppins mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Kelola Pesanan", desc: "Tambah & pantau pesanan", to: "/pesanan", color: "from-blue-50 to-white border-blue-100" },
          { label: "Kelola Jadwal", desc: "Atur slot penjemputan", to: "/jadwal", color: "from-indigo-50 to-white border-indigo-100" },
          { label: "Laporan Pendapatan", desc: "Lihat tren keuangan", to: "/laporan", color: "from-emerald-50 to-white border-emerald-100" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`rounded-xl border bg-linear-to-br ${item.color} p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
          >
            <p className="font-inter-semibold text-gray-800">{item.label}</p>
            <p className="text-sm text-gray-500 mt-1 font-poppins">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-inter-semibold text-lg text-gray-800">Pesanan Terbaru</h2>
          <Link className="text-sm text-[#3b6fd8] font-inter-medium hover:underline" to="/pesanan">
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                {["Seri", "Nama Pelanggan", "Alamat", "Tanggal", "Waktu Jemput", "Status"].map((label) => (
                  <th key={label} className="text-left px-6 py-4 text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 5).map((order, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-inter-medium text-gray-800">{order.seri}</td>
                  <td className="px-6 py-4 text-sm font-inter-medium text-gray-800">{order.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-poppins max-w-xs truncate">{order.address}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-poppins">{order.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-poppins">{order.time}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
