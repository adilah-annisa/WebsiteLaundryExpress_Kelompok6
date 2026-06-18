import { useMemo, useState } from "react";
import { useData } from "../../context/DataContext";
import StatusBadge from "../../components/StatusBadge";
import { IoMapOutline, IoCallOutline, IoTimeOutline, IoPersonOutline } from "react-icons/io5";

const STATUS_FLOW = ["Diproses", "Dijemput"];

export default function Jemput() {
  const { orders, updateOrder } = useData();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [toast, setToast] = useState("");

  const tasks = useMemo(() => {
    const q = query.toLowerCase();
    return orders
      .filter((o) => o.pengantaran === "jemput" && o.slotId && ["Diproses", "Dijemput"].includes(o.status))
      .map((o) => ({
        kode: o.id,
        nama: o.nama,
        alamat: o.alamat,
        telepon: o.nohp,
        waktu: o.jam,
        tanggal: o.tanggal,
        status: o.status,
        catatan: o.catatan,
      }))
      .filter((t) => [t.kode, t.nama, t.alamat].some((v) => v.toLowerCase().includes(q)));
  }, [orders, query]);

  const handleUpdateStatus = () => {
    if (!selected || !newStatus) return;
    updateOrder(selected.kode, { status: newStatus });
    setSelected((prev) => (prev ? { ...prev, status: newStatus } : prev));
    setConfirmOpen(false);
    setToast(`Status ${selected.kode} diperbarui menjadi ${newStatus}`);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl bg-slate-900 text-white px-5 py-3 text-sm font-semibold shadow-lg">{toast}</div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b">
          <h2 className="font-semibold text-lg">Jadwal Penjemputan</h2>
          <p className="text-sm text-gray-500">{tasks.length} tugas</p>
        </div>

        <div className="px-6 py-4 border-b">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kode, nama, alamat..."
            className="w-full px-4 py-2.5 border rounded-xl"
          />
        </div>

        {tasks.length === 0 ? (
          <p className="px-6 py-12 text-center text-gray-500">Belum ada tugas penjemputan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  {["Kode", "Pelanggan", "Alamat", "Tanggal", "Waktu", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {tasks.map((task) => (
                  <tr key={task.kode} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold">{task.kode}</td>
                    <td className="px-6 py-4 text-sm">{task.nama}</td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate">{task.alamat}</td>
                    <td className="px-6 py-4 text-sm">{task.tanggal}</td>
                    <td className="px-6 py-4 text-sm">{task.waktu}</td>
                    <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                    <td className="px-6 py-4">
                      <button type="button" onClick={() => setSelected(task)} className="text-sm text-[#1565C0] font-semibold hover:underline">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative max-w-lg mx-auto mt-16 px-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-5 border-b flex justify-between">
                <div>
                  <h3 className="font-semibold text-xl">Detail Penjemputan</h3>
                  <p className="text-sm text-gray-500">{selected.kode}</p>
                </div>
                <button type="button" onClick={() => setSelected(null)}>✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <IoPersonOutline className="text-2xl text-blue-600" />
                  <div>
                    <p className="font-semibold">{selected.nama}</p>
                    <a href={`tel:${selected.telepon}`} className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                      <IoCallOutline /> {selected.telepon}
                    </a>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs uppercase text-gray-500 flex items-center gap-1"><IoMapOutline /> Alamat</p>
                  <p className="text-sm mt-2">{selected.alamat}</p>
                </div>
                <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm flex items-center gap-1"><IoTimeOutline /> {selected.tanggal} {selected.waktu}</span>
                  <StatusBadge status={selected.status} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_FLOW.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={selected.status === status}
                        onClick={() => { setNewStatus(status); setConfirmOpen(true); }}
                        className="px-4 py-2 rounded-xl border text-sm font-semibold disabled:opacity-40"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmOpen && selected && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmOpen(false)} />
          <div className="relative max-w-md mx-auto mt-32 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h4 className="font-semibold text-lg">Konfirmasi</h4>
              <p className="text-sm text-gray-600 mt-2">Ubah status {selected.kode} menjadi <strong>{newStatus}</strong>?</p>
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => setConfirmOpen(false)} className="flex-1 py-2.5 rounded-xl border font-semibold">Batal</button>
                <button type="button" onClick={handleUpdateStatus} className="flex-1 py-2.5 rounded-xl bg-[#1565C0] text-white font-semibold">Ya, Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
