import { IoShirtOutline, IoCubeOutline, IoTimeOutline, IoCloseCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import StatusBadge from "../../components/StatusBadge";
import StatCard from "../../components/StatCard";
import { formatRupiah } from "../../lib/constants";

const iconMap = { IoShirtOutline, IoCubeOutline, IoTimeOutline, IoCloseCircleOutline };

export default function DashboardPelanggan() {
  const { user } = useAuth();
  const { getOrdersForCustomer } = useData();
  const orders = getOrdersForCustomer(user.customerId);

  const stats = [
    { label: "Total Pesanan", value: String(orders.length), iconName: "IoShirtOutline", color: "#3B82F6", bgIcon: "bg-blue-50" },
    { label: "Selesai", value: String(orders.filter((o) => o.status === "Selesai").length), iconName: "IoCubeOutline", color: "#22C55E", bgIcon: "bg-green-50" },
    { label: "Diproses", value: String(orders.filter((o) => !["Selesai"].includes(o.status)).length), iconName: "IoTimeOutline", color: "#F59E0B", bgIcon: "bg-yellow-50" },
    { label: "Menunggu Jadwal", value: String(orders.filter((o) => !o.slotId).length), iconName: "IoCloseCircleOutline", color: "#EF4444", bgIcon: "bg-red-50" },
  ];

  return (
    <div className="w-full max-w-screen-xl mx-auto space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.iconName];
          return (
            <StatCard key={index} icon={Icon} label={stat.label} value={stat.value} color={stat.color} bgIcon={stat.bgIcon} />
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <h2 className="font-inter-semibold text-lg text-gray-800">Pesanan Saya</h2>
          <Link to="/pelanggan/riwayat" className="text-sm text-[#3b6fd8] font-medium hover:underline">
            Lihat Semua →
          </Link>
        </div>

        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <p className="px-6 py-12 text-center text-gray-500">Belum ada pesanan.</p>
          ) : (
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b">
                  {["Kode", "Layanan", "Tanggal", "Biaya", "Status"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold">{order.id}</td>
                    <td className="px-6 py-4 text-sm">{order.layananLabel}</td>
                    <td className="px-6 py-4 text-sm">{order.tanggal || order.createdAt}</td>
                    <td className="px-6 py-4 text-sm">
                      {order.berat != null ? formatRupiah(order.total) : "Menunggu Penimbangan"}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
