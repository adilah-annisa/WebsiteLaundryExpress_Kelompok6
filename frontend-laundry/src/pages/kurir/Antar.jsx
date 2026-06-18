import { useMemo, useState } from "react";
import kurirData from "../../data/kurirData.json";
import StatusBadge from "../../components/StatusBadge";
import {
  IoCheckmarkCircleOutline,
  IoMapOutline,
  IoCallOutline,
  IoTimeOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";

const JENIS = "Pengantaran";
const STATUS_FLOW = ["Diproses", "Diantar", "Selesai"];

export default function Antar() {
  const initialTasks = kurirData.tasks.filter((item) => item.jenis === JENIS);
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [toast, setToast] = useState("");

  const completedCount = tasks.filter((item) => item.status === "Selesai" || item.status === "Diantar").length;

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return tasks.filter((task) => {
      const matchQuery = [task.kode, task.nama, task.alamat].some((v) => v.toLowerCase().includes(q));
      const matchStatus = statusFilter === "all" || task.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [tasks, query, statusFilter]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleUpdateStatus = () => {
    if (!selected || !newStatus) return;
    setTasks((prev) =>
      prev.map((t) => (t.kode === selected.kode ? { ...t, status: newStatus } : t))
    );
    setSelected((prev) => (prev ? { ...prev, status: newStatus } : prev));
    setConfirmOpen(false);
    showToast(`Status ${selected.kode} diperbarui menjadi ${newStatus}`);
  };

  const openStatusConfirm = (status) => {
    setNewStatus(status);
    setConfirmOpen(true);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl bg-slate-900 text-white px-5 py-3 text-sm font-inter-semibold shadow-lg">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Pengantaran", value: tasks.length, colors: "from-blue-50 to-blue-100 border-blue-200" },
          { label: "Selesai / Diantar", value: completedCount, colors: "from-green-50 to-green-100 border-green-200" },
          { label: "Sisa Tugas", value: tasks.length - completedCount, colors: "from-yellow-50 to-yellow-100 border-yellow-200" },
        ].map((card) => (
          <div key={card.label} className={`bg-linear-to-br ${card.colors} rounded-xl p-4 border hover:shadow-md transition-shadow`}>
            <p className="text-xs font-inter-semibold uppercase mb-1 opacity-70">{card.label}</p>
            <p className="text-2xl font-inter-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="px-6 py-5 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-inter-semibold text-lg text-gray-800">Jadwal Pengantaran Hari Ini</h2>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} pengantaran ditampilkan</p>
          </div>
          <Link
            to="/kurir/bukti"
            className="text-sm font-inter-semibold text-[#1565C0] hover:underline"
          >
            Upload Bukti →
          </Link>
        </div>

        <div className="px-6 py-4 flex flex-col sm:flex-row gap-3 border-b border-gray-100">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kode, nama, alamat..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 font-inter"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 font-inter bg-white"
          >
            <option value="all">Semua Status</option>
            {STATUS_FLOW.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {["Kode", "Nama Pelanggan", "Alamat", "Waktu", "Status", "Aksi"].map((label) => (
                  <th key={label} className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((task) => (
                  <tr key={task.kode} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-inter-semibold text-gray-800">{task.kode}</td>
                    <td className="px-6 py-4 text-sm font-inter-medium text-gray-700">{task.nama}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-poppins max-w-xs truncate">{task.alamat}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-inter-semibold">{task.waktu}</td>
                    <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelected(task)}
                        className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-inter-medium bg-blue-50 text-[#3b6fd8] hover:bg-blue-100 transition-all"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <IoCheckmarkCircleOutline className="text-4xl text-green-500 mb-3" />
                      <p className="text-gray-500 font-poppins">Tidak ada pengantaran yang cocok.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative max-w-lg mx-auto mt-16 px-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b bg-linear-to-r from-gray-50 to-white flex items-start justify-between">
                <div>
                  <h3 className="font-inter-semibold text-xl text-gray-800">Detail Pengantaran</h3>
                  <p className="text-sm text-gray-500 mt-1">{selected.kode}</p>
                </div>
                <button type="button" onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-gray-100">✕</button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <IoPersonOutline className="text-2xl text-[#3b6fd8]" />
                  <div>
                    <p className="font-inter-semibold text-gray-800">{selected.nama}</p>
                    <a href={`tel:${selected.telepon}`} className="text-sm text-[#1565C0] flex items-center gap-1 mt-1 hover:underline">
                      <IoCallOutline /> {selected.telepon}
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-inter-semibold text-gray-500 uppercase flex items-center gap-1">
                    <IoMapOutline /> Alamat Lengkap
                  </p>
                  <p className="text-sm text-gray-800 mt-2 font-poppins">{selected.alamat}</p>
                  {selected.catatan && (
                    <p className="text-xs text-gray-500 mt-2 italic">Catatan: {selected.catatan}</p>
                  )}
                </div>

                <div className="h-32 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center border border-slate-200">
                  <p className="text-sm text-slate-500 font-poppins flex items-center gap-2">
                    <IoMapOutline className="text-xl" /> Peta alamat (integrasi maps)
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 flex items-center gap-1"><IoTimeOutline /> {selected.waktu}</span>
                  <StatusBadge status={selected.status} />
                </div>

                <div>
                  <p className="text-sm font-inter-semibold text-gray-700 mb-2">Update Status Pengiriman</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_FLOW.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={selected.status === status}
                        onClick={() => openStatusConfirm(status)}
                        className="px-4 py-2 rounded-xl text-sm font-inter-semibold border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  {selected.status === "Diantar" && (
                    <p className="text-xs text-blue-600 mt-2 font-poppins">
                      Jangan lupa <Link to="/kurir/bukti" className="underline font-inter-semibold">upload bukti pengantaran</Link>.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmOpen && selected && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
          <div className="relative max-w-md mx-auto mt-32 px-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h4 className="font-inter-semibold text-lg text-gray-900">Konfirmasi Update Status</h4>
              <p className="text-sm text-gray-600 mt-2 font-poppins">
                Ubah status {selected.kode} menjadi <strong>{newStatus}</strong>?
              </p>
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => setConfirmOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 font-inter-semibold hover:bg-gray-50">
                  Batal
                </button>
                <button type="button" onClick={handleUpdateStatus} className="flex-1 px-4 py-2.5 rounded-xl bg-[#1565C0] text-white font-inter-semibold hover:bg-[#0f4d8a]">
                  Ya, Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
