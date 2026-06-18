import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import StatusBadge from "../../components/StatusBadge";
import StatCard from "../../components/StatCard";
import {
  IoClipboardOutline,
  IoCarOutline,
  IoTimeOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";

export default function DashboardKurir() {
  const { getKurirTasks } = useData();
  const { pickups, deliveries, all } = getKurirTasks();

  const stats = [
    { label: "Total Tugas", value: String(all.length), icon: IoClipboardOutline, color: "#3B82F6", bgIcon: "bg-blue-50" },
    { label: "Penjemputan", value: String(pickups.length), icon: IoTimeOutline, color: "#F59E0B", bgIcon: "bg-yellow-50" },
    { label: "Pengantaran", value: String(deliveries.length), icon: IoCarOutline, color: "#3B82F6", bgIcon: "bg-blue-50" },
    { label: "Selesai", value: String(all.filter((t) => t.status === "Selesai").length), icon: IoCheckmarkDoneOutline, color: "#22C55E", bgIcon: "bg-green-50" },
  ];

  return (
    <div className="w-full max-w-screen-xl mx-auto space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} icon={stat.icon} label={stat.label} value={stat.value} color={stat.color} bgIcon={stat.bgIcon} />
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <h2 className="font-semibold text-lg">Jadwal Tugas Kurir</h2>
          <Link to="/kurir/jemput" className="text-sm text-[#3b6fd8] hover:underline">Lihat Semua →</Link>
        </div>

        {all.length === 0 ? (
          <p className="px-6 py-12 text-center text-gray-500">Belum ada tugas antar-jemput.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] hidden md:table">
              <thead>
                <tr className="bg-gray-50 border-b">
                  {["Kode", "Nama", "Alamat", "Tanggal", "Waktu", "Jenis", "Status"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {all.slice(0, 8).map((task) => (
                  <tr key={task.kode + task.jenis} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold">{task.kode}</td>
                    <td className="px-6 py-4 text-sm">{task.nama}</td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate">{task.alamat}</td>
                    <td className="px-6 py-4 text-sm">{task.tanggal}</td>
                    <td className="px-6 py-4 text-sm">{task.waktu}</td>
                    <td className="px-6 py-4 text-sm">{task.jenis}</td>
                    <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="md:hidden space-y-3 p-4">
              {all.slice(0, 5).map((task) => (
                <div key={task.kode + task.jenis} className="rounded-lg border p-3">
                  <p className="font-semibold text-sm">{task.kode} • {task.nama}</p>
                  <p className="text-xs text-gray-500 mt-1">{task.alamat}</p>
                  <p className="text-xs mt-2">{task.tanggal} {task.waktu} — {task.jenis}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
