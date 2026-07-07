import {
  IoShirtOutline,
  IoCubeOutline,
  IoTimeOutline,
  IoCloseCircleOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import StatusBadge from "../../DashboardAdmin/components/StatusBadge";
import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { formatRupiah } from "../../lib/constants";
import RoleShortcuts from "../../components/RoleShortcuts";
import { useMemo } from "react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";

const iconMap = {
  IoShirtOutline,
  IoCubeOutline,
  IoTimeOutline,
  IoCloseCircleOutline,
};

export default function Dashboard() {
  const { orders, totalPendapatan } = useData();
  const { transactions } = useData();

  const weekly = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });

    const sums = days.map((day) => {
      const total = transactions
        .filter((t) => t.date === day && (t.status === "Lunas" || String(t.status).toLowerCase() === "lunas"))
        .reduce((acc, t) => acc + (t.amountNum || Number(String(t.amount || "").replace(/[^0-9]/g, "")) || 0), 0);
      return { day, total };
    });
    return sums;
  }, [transactions]);

  const stats = [
    { label: "Total Pesanan", value: String(orders.length), iconName: "IoShirtOutline", color: "#3b82f6", bgIcon: "bg-blue-50" },
    { label: "Selesai", value: String(orders.filter((o) => o.status === "Selesai").length), iconName: "IoCubeOutline", color: "#10b981", bgIcon: "bg-green-50" },
    { label: "Diproses", value: String(orders.filter((o) => o.status !== "Selesai").length), iconName: "IoTimeOutline", color: "#f59e0b", bgIcon: "bg-yellow-50" },
    { label: "Pendapatan", value: formatRupiah(totalPendapatan), iconName: "IoCloseCircleOutline", color: "#ef4444", bgIcon: "bg-red-50" },
  ];

  return (
    <div className="space-y-8 max-w-screen-2xl mx-auto">
      <RoleShortcuts role="admin" />
      <div className="rounded-2xl bg-linear-to-r from-[#1565C0] to-[#3b6fd8] p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-blue-100 text-sm font-poppins">Laundry Express — Panel Pemilik</p>
            <h2 className="font-inter-semibold text-2xl mt-1">Selamat datang, Admin!</h2>
            <p className="text-blue-100 text-sm mt-2 font-poppins">Pantau pesanan, jadwal, dan keuangan laundry Anda.</p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
            <IoTrendingUpOutline className="text-2xl" />
            <div>
              <p className="text-xs text-blue-100">Total pendapatan</p>
              <p className="font-inter-semibold text-lg">{formatRupiah(totalPendapatan)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.iconName];
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-all">
              <div className={`w-14 h-14 rounded-xl ${stat.bgIcon} flex items-center justify-center`}>
                <Icon className="text-2xl" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="font-inter-semibold text-2xl text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500 font-poppins mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Pendapatan Mingguan</p>
          <div className="mt-4 h-36 flex items-end gap-3">
            {weekly.map((w) => {
              const max = Math.max(1, ...weekly.map((s) => s.total));
              const h = Math.round((w.total / max) * 100);
              return (
                <div key={w.day} className="flex-1 text-center">
                  <div className="h-24 flex items-end justify-center">
                    <div className="w-8 rounded-t-md bg-blue-600" style={{ height: `${h}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{w.day.slice(5)}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Ringkasan Hari Ini</p>
          <p className="mt-3 text-2xl font-inter-semibold">{formatRupiah(totalPendapatan)}</p>
          <p className="text-sm text-gray-500 mt-1">Pendapatan kumulatif dari transaksi Lunas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Kelola Pesanan", desc: "Tambah & pantau pesanan", to: "/dashboard/pesanan", color: "from-blue-50 to-white border-blue-100" },
          { label: "Kelola Jadwal", desc: "Atur slot antar-jemput", to: "/dashboard/jadwal", color: "from-indigo-50 to-white border-indigo-100" },
          { label: "Keuangan", desc: "Catat transaksi", to: "/dashboard/keuangan", color: "from-emerald-50 to-white border-emerald-100" },
        ].map((item) => (
          <Link key={item.to} to={item.to} className={`rounded-xl border bg-linear-to-br ${item.color} p-5 hover:shadow-md transition-all`}>
            <p className="font-inter-semibold text-gray-800">{item.label}</p>
            <p className="text-sm text-gray-500 mt-1 font-poppins">{item.desc}</p>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="font-semibold text-lg text-slate-900">Pesanan Terbaru</h2>
          <Link className="text-sm text-blue-600 font-medium hover:underline" to="/dashboard/pesanan">Lihat Semua</Link>
        </CardHeader>
        <CardBody className="p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                {["Kode", "Pelanggan", "Layanan", "Jadwal", "Status"].map((label) => (
                  <th key={label} className="text-left px-6 py-4 text-xs font-inter-semibold text-gray-600 uppercase">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                  <td className="px-6 py-4 text-sm">{order.nama}</td>
                  <td className="px-6 py-4 text-sm">{order.layananLabel}</td>
                  <td className="px-6 py-4 text-sm">{order.tanggal ? `${order.tanggal} ${order.jam}` : "-"}</td>
                  <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
