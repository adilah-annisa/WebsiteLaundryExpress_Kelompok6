import {
  IoClipboardOutline,
  IoCarOutline,
  IoTimeOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";

import kurirData from "../../data/kurirData.json";
import StatusBadge from "../../components/StatusBadge";
import StatCard from "../../components/StatCard";
import { Link } from "react-router-dom";

const iconMap = {
  IoClipboardOutline,
  IoCarOutline,
  IoTimeOutline,
  IoCheckmarkDoneOutline,
};

export default function DashboardKurir() {
  const { stats, tasks } = kurirData;

  return (
    <div className="space-y-8">
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <h2 className="font-inter-semibold text-lg text-gray-800">
            Tugas Kurir Hari Ini
          </h2>

          <Link
            to="/kurir/jemput"
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
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Alamat
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Jenis
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {tasks && tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-inter-semibold text-gray-800">
                      {task.kode}
                    </td>
                    <td className="px-6 py-4 text-sm font-inter-medium text-gray-700">
                      {task.nama}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-poppins">
                      {task.alamat}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-poppins">
                      {task.waktu}
                    </td>
                    <td className="px-6 py-4 text-sm font-inter-medium">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-inter-semibold ${
                          task.jenis === "Penjemputan"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {task.jenis}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={task.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <p className="text-gray-500 font-poppins">
                      Tidak ada tugas untuk hari ini.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Mobile list for small screens */}
          <div className="md:hidden space-y-3 px-2 py-3">
            {tasks && tasks.length > 0 ? (
              tasks.map((task, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-inter-semibold text-gray-800">{task.kode} • {task.nama}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{task.alamat}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{task.waktu}</p>
                      <div className="mt-2"><StatusBadge status={task.status} /></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <p className="text-gray-500">Tidak ada tugas untuk hari ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}