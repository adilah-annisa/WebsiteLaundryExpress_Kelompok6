import {
  IoShirtOutline,
  IoCubeOutline,
  IoTimeOutline,
  IoCloseCircleOutline,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.iconName];
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-inter-semibold text-lg text-gray-800">Pesanan Terbaru</h2>
          
          <Link className="text-sm text-[#3b6fd8] font-inter-medium hover:underline"
           to="/pesanan">
            Lihat Semua
          </Link>

        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left px-6 py-4 text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Seri
                </th>
                <th className="text-left px-6 py-4 text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Nama Pelanggan
                </th>
                <th className="text-left px-6 py-4 text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Alamat
                </th>
                <th className="text-left px-6 py-4 text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="text-left px-6 py-4 text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Waktu Jemput
                </th>
                <th className="text-left px-6 py-4 text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-inter-medium text-gray-800">
                    {order.seri}
                  </td>
                  <td className="px-6 py-4 text-sm font-inter-medium text-gray-800">
                    {order.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-poppins">
                    {order.address}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-poppins">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-poppins">
                    {order.time}
                  </td>
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
