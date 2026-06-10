import {
  IoShirtOutline,
  IoCubeOutline,
  IoTimeOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import pelangganData from "../../data/pelangganData.json";
import StatusBadge from "../../DashboardAdmin/components/StatusBadge";
import StatCard from "../../components/StatCard";
import { Link } from "react-router-dom";

const iconMap = {
  IoShirtOutline,
  IoCubeOutline,
  IoTimeOutline,
  IoCloseCircleOutline,
};

export default function DashboardPelanggan() {
  const { stats, orders } = pelangganData;

  return (
    <div className="space-y-8">
      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.iconName];
          return (
            <StatCard
              key={index}
              icon={Icon}
              label={stat.label}
              value={stat.value}
              color={stat.color}
              bgIcon={stat.bgIcon}
            />
          );
        })}
      </div>

      {/* Pesanan Saya */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <h2 className="font-inter-semibold text-lg text-gray-800">
            Pesanan Saya
          </h2>

          <Link
            to="/pelanggan/riwayat"
            className="text-sm text-[#3b6fd8] font-inter-medium hover:text-[#1565C0] hover:underline transition-colors"
          >
            Lihat Semua →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full hidden md:table">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Kode
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Layanan
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Berat
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-inter-semibold text-gray-800">
                      {order.kode}
                    </td>
                    <td className="px-6 py-4 text-sm font-inter-medium text-gray-700">
                      {order.layanan}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-poppins">
                      {order.tanggal}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-poppins">
                      {order.berat}
                    </td>
                    <td className="px-6 py-4 text-sm font-inter-semibold text-gray-800">
                      {order.total}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <p className="text-gray-500 font-poppins">
                      Belum ada pesanan. Mulai pesan laundry sekarang!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Mobile list */}
          <div className="md:hidden space-y-3 px-2 py-3">
            {orders.length > 0 ? (
              orders.map((order, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-inter-semibold text-gray-800">{order.kode}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.layanan} • {order.tanggal}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-inter-semibold text-gray-800">{order.total}</p>
                      <div className="mt-2"><StatusBadge status={order.status} /></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <p className="text-gray-500">Belum ada pesanan. Mulai pesan laundry sekarang!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}