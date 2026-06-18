import { useMemo, useState } from "react";
import PageHeader from "../../DashboardAdmin/components/PageHeader";
import StatusBadge from "../../DashboardAdmin/components/StatusBadge";
import { useData } from "../../context/DataContext";
import { formatRupiah } from "../../lib/constants";

const statusOptions = ["Lunas", "Belum Lunas"];
const initialForm = { seri: "", name: "", date: "", amount: "", status: "Lunas" };

export default function Keuangan() {
  const { transactions, totalPendapatan, addTransaction, orders } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");

  const filteredTransactions = useMemo(() => {
    const q = search.toLowerCase();
    return transactions.filter((item) => {
      const matchSearch = [item.seri, item.name].some((v) => v.toLowerCase().includes(q));
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [transactions, search, statusFilter]);

  const summaryCards = [
    { label: "Total Pendapatan", value: formatRupiah(totalPendapatan), bg: "bg-green-50", text: "text-green-700" },
    { label: "Pesanan Lunas", value: transactions.filter((t) => t.status === "Lunas").length, bg: "bg-blue-50", text: "text-blue-700" },
    { label: "Pesanan Pending", value: transactions.filter((t) => t.status === "Belum Lunas").length, bg: "bg-orange-50", text: "text-orange-700" },
  ];

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage("");
  };

  const handleSave = () => {
    const result = addTransaction(form);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setForm(initialForm);
    setShowForm(false);
    setMessage("");
    setToast("Transaksi berhasil ditambahkan. Total pendapatan diperbarui.");
    setTimeout(() => setToast(""), 3000);
  };

  const fillFromOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    setForm({
      seri: order.id,
      name: order.nama,
      date: new Date().toISOString().split("T")[0],
      amount: order.total != null ? formatRupiah(order.total) : "",
      status: "Lunas",
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl bg-slate-900 text-white px-5 py-3 text-sm font-semibold shadow-lg">
          {toast}
        </div>
      )}

      <PageHeader title="Keuangan & Transaksi" subtitle="Catat transaksi dan pantau pendapatan" showSearch={false} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card) => (
          <div key={card.label} className={`rounded-2xl p-6 shadow-sm ${card.bg}`}>
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${card.text}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari seri atau nama..."
              className="px-4 py-2.5 border rounded-xl w-56"
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border rounded-xl bg-white">
              <option value="all">Semua Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((p) => !p)}
            className="rounded-xl bg-[#1565C0] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0f4d8a]"
          >
            {showForm ? "Tutup Form" : "+ Tambah Transaksi"}
          </button>
        </div>

        {message && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{message}</div>
        )}

        {showForm && (
          <div className="rounded-2xl border bg-gray-50 p-6">
            <h2 className="text-lg font-semibold mb-4">Form Tambah Transaksi</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { label: "Seri Pesanan", field: "seri", type: "text" },
                { label: "Nama Pelanggan", field: "name", type: "text" },
                { label: "Tanggal", field: "date", type: "date" },
                { label: "Jumlah", field: "amount", type: "text" },
              ].map((item) => (
                <div key={item.field}>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">{item.label}</label>
                  <input
                    type={item.type}
                    value={form[item.field]}
                    onChange={(e) => handleInputChange(item.field, e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Status Bayar</label>
                <select value={form.status} onChange={(e) => handleInputChange("status", e.target.value)} className="w-full px-4 py-2.5 border rounded-xl bg-white">
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">Isi cepat dari pesanan lunas:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {orders.filter((o) => o.total != null).slice(0, 4).map((o) => (
                <button key={o.id} type="button" onClick={() => fillFromOrder(o.id)} className="text-xs px-3 py-1 rounded-full border hover:bg-white">
                  {o.id}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3 rounded-xl border font-semibold">Batal</button>
              <button type="button" onClick={handleSave} className="px-5 py-3 rounded-xl bg-[#1565C0] text-white font-semibold">Simpan Transaksi</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                {["Seri", "Nama", "Tanggal", "Jumlah", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm">{item.seri}</td>
                    <td className="px-4 py-4 text-sm">{item.name}</td>
                    <td className="px-4 py-4 text-sm">{item.date}</td>
                    <td className="px-4 py-4 text-sm">{item.amount}</td>
                    <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-gray-500">Tidak ada transaksi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
