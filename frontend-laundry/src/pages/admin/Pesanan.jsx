import { useState } from "react";
import PageHeader from "../../DashboardAdmin/components/PageHeader";
import StatusBadge from "../../DashboardAdmin/components/StatusBadge";
import { useData } from "../../context/DataContext";
import { ADMIN_ORDER_STATUSES, formatRupiah } from "../../lib/constants";

export default function Pesanan() {
  const { orders, updateOrder, setOrderWeight, getOrderById } = useData();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [beratInput, setBeratInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredOrders = orders.filter((order) =>
    [order.nama, order.id].some((v) => v.toLowerCase().includes(query.toLowerCase()))
  );

  const openDetail = (order) => {
    setSelected(order);
    setEditStatus(order.status);
    setBeratInput(order.berat != null ? String(order.berat) : "");
    setMessage("");
    setError("");
  };

  const handleSave = () => {
    if (!selected) return;

    updateOrder(selected.id, { status: editStatus });

    if (beratInput.trim()) {
      const result = setOrderWeight(selected.id, beratInput);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setMessage(`Berat ${result.berat} Kg disimpan. Total: ${result.formatted}`);
    } else {
      setMessage("Data pesanan berhasil diperbarui.");
    }

    const updated = getOrderById(selected.id);
    if (updated) setSelected(updated);
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Kelola Pesanan" subtitle="Lihat dan kelola data pesanan pelanggan" showSearch={false} />

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama atau kode pesanan..."
          className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200"
        />

        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Daftar pesanan kosong.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  {["Kode", "Pelanggan", "Layanan", "Jadwal", "Berat", "Total", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium">{order.id}</td>
                    <td className="px-4 py-4 text-sm">{order.nama}</td>
                    <td className="px-4 py-4 text-sm">{order.layananLabel}</td>
                    <td className="px-4 py-4 text-sm">{order.tanggal ? `${order.tanggal} ${order.jam}` : "-"}</td>
                    <td className="px-4 py-4 text-sm">{order.berat != null ? `${order.berat} Kg` : "Menunggu"}</td>
                    <td className="px-4 py-4 text-sm">{order.total != null ? formatRupiah(order.total) : "-"}</td>
                    <td className="px-4 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => openDetail(order)}
                        className="text-sm text-[#1565C0] font-semibold hover:underline"
                      >
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
          <div className="relative max-w-2xl mx-auto mt-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-5 border-b flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-xl">Detail Pesanan {selected.id}</h3>
                  <p className="text-sm text-gray-500">{selected.nama} • {selected.nohp}</p>
                </div>
                <button type="button" onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
              </div>

              <div className="p-6 space-y-4">
                {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">{error}</div>}
                {message && <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{message}</div>}

                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <p><span className="text-gray-500">Alamat:</span> {selected.alamat}</p>
                  <p><span className="text-gray-500">Layanan:</span> {selected.layananLabel}</p>
                  <p><span className="text-gray-500">Tarif:</span> Rp {selected.tarifPerKg.toLocaleString("id-ID")}/Kg</p>
                  <p><span className="text-gray-500">Jadwal:</span> {selected.tanggal ? `${selected.tanggal} ${selected.jam}` : "Belum dipilih"}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status Pesanan</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl bg-white"
                  >
                    {ADMIN_ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">Input Berat Laundry (Kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={beratInput}
                    onChange={(e) => { setBeratInput(e.target.value); setError(""); }}
                    placeholder="Contoh: 3.5"
                    className="w-full px-4 py-2.5 border rounded-xl bg-white"
                  />
                  {beratInput && selected.tarifPerKg && (
                    <p className="mt-2 text-sm text-blue-800">
                      Estimasi: {beratInput} Kg × Rp {selected.tarifPerKg.toLocaleString("id-ID")} ={" "}
                      {formatRupiah(Number(beratInput) * selected.tarifPerKg)}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t flex gap-3 justify-end">
                <button type="button" onClick={() => setSelected(null)} className="px-5 py-2.5 rounded-xl border hover:bg-gray-50 font-semibold">
                  Tutup
                </button>
                <button type="button" onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-[#1565C0] text-white font-semibold hover:bg-[#0f4d8a]">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
