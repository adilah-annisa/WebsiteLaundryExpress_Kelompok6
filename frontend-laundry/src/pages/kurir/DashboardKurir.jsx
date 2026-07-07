import { Link } from "react-router-dom";
import RoleShortcuts from "../../components/RoleShortcuts";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { useData } from "../../context/DataContext";
import StatusBadge from "../../components/StatusBadge";
import StatCard from "../../components/StatCard";
import EmptyState from "../../components/ui/EmptyState";
import {
  IoClipboardOutline,
  IoCarOutline,
  IoTimeOutline,
  IoCheckmarkDoneOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";

export default function DashboardKurir() {
  const { getKurirTasks } = useData();
  const { pickups, deliveries, all } = getKurirTasks();

  const pendingTasks = all.filter((task) => task.status !== "Selesai");

  const stats = [
    { label: "Total Tugas", value: String(all.length), icon: IoClipboardOutline, color: "#3B82F6", bgIcon: "bg-blue-50" },
    { label: "Penjemputan", value: String(pickups.length), icon: IoTimeOutline, color: "#F59E0B", bgIcon: "bg-yellow-50" },
    { label: "Pengantaran", value: String(deliveries.length), icon: IoCarOutline, color: "#3B82F6", bgIcon: "bg-blue-50" },
    { label: "Selesai", value: String(all.filter((t) => t.status === "Selesai").length), icon: IoCheckmarkDoneOutline, color: "#22C55E", bgIcon: "bg-green-50" },
  ];

  return (
    <div className="w-full max-w-screen-2xl mx-auto space-y-8">
      <RoleShortcuts role="kurir" />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} icon={stat.icon} label={stat.label} value={stat.value} color={stat.color} bgIcon={stat.bgIcon} />
          ))}
        </div>

        <Card>
          <CardHeader title="Proses Kurir" subtitle="Langkah kerja untuk tugas harian" />
          <CardBody className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">1. Ambil / antar laundry</p>
              <p className="text-sm text-slate-500 mt-1">Tangani penjemputan atau pengantaran sesuai tugas yang terdaftar.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">2. Upload bukti</p>
              <p className="text-sm text-slate-500 mt-1">Unggah foto sebagai bukti bahwa tugas sudah dilakukan.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">3. Tunggu konfirmasi pelanggan</p>
              <p className="text-sm text-slate-500 mt-1">Pelanggan akan menyelesaikan pesanan setelah melihat bukti pengantaran/penjemputan.</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Card>
          <CardHeader title="Tugas Kurir" subtitle="Tugas terbaru dan status saat ini" />
          <CardBody>
            {all.length === 0 ? (
              <EmptyState
                icon={IoClipboardOutline}
                title="Belum ada tugas saat ini"
                description="Tidak ada order penjemputan atau pengantaran yang perlu ditangani sekarang."
                action={<Link to="/kurir/antar" className="inline-flex items-center rounded-xl bg-[#1565C0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f4d8a]">Periksa Halaman Tugas</Link>}
              />
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full min-w-160 text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        {['Kode', 'Jenis', 'Nama', 'Waktu', 'Status'].map((h) => (
                          <th key={h} className="px-5 py-3 text-xs font-semibold uppercase text-slate-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y bg-white">
                      {all.slice(0, 7).map((task) => (
                        <tr key={task.kode + task.jenis} className="hover:bg-slate-50">
                          <td className="px-5 py-4 text-sm font-semibold text-slate-900">{task.kode}</td>
                          <td className="px-5 py-4 text-sm text-slate-600">{task.jenis}</td>
                          <td className="px-5 py-4 text-sm text-slate-600 truncate">{task.nama}</td>
                          <td className="px-5 py-4 text-sm text-slate-600">{task.tanggal} {task.waktu}</td>
                          <td className="px-5 py-4"><StatusBadge status={task.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end">
                  <Link to="/kurir/jemput" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1565C0] hover:text-[#0f4d8a]">
                    Lihat Semua Tugas <IoChevronForwardOutline />
                  </Link>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Tugas Menunggu" subtitle="Order yang belum selesai" />
          <CardBody>
            {pendingTasks.length === 0 ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center text-sm text-green-800">
                Semua tugas sudah selesai. Terus pertahankan performa yang baik.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTasks.slice(0, 4).map((task) => (
                  <div key={task.kode + task.jenis} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{task.kode}</p>
                        <p className="text-xs text-slate-500">{task.jenis} • {task.tanggal} {task.waktu}</p>
                      </div>
                      <StatusBadge status={task.status} />
                    </div>
                    <p className="mt-3 text-sm text-slate-600 truncate">{task.alamat}</p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
