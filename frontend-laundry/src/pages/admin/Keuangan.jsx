import { useMemo, useState } from "react";
import PageHeader from "../../DashboardAdmin/components/PageHeader";
import StatusBadge from "../../DashboardAdmin/components/StatusBadge";
import { useData } from "../../context/DataContext";
import { formatRupiah } from "../../lib/constants";

const initialForm = { amount: "", keterangan: "" };

export default function Keuangan() {
  const { transactions, addTransaction } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });

  const monthRecords = useMemo(
    () => transactions.filter((item) => item.date?.slice(0, 7) === selectedMonth),
    [transactions, selectedMonth]
  );

  const monthlyTotal = useMemo(
    () => monthRecords.reduce((sum, item) => sum + (item.amountNum || 0), 0),
    [monthRecords]
  );

  const summaryCards = [
    {
      label: "Total Pendapatan Bulanan",
      value: formatRupiah(monthlyTotal),
      bg: "bg-green-50",
      text: "text-green-700",
    },
  ];

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage("");
  };

  const todayDate = new Date().toISOString().slice(0, 10);

  const handleSave = () => {
    if (!form.amount.trim()) {
      setMessage("Masukkan total pendapatan harian.");
      return;
    }

    const result = addTransaction({
      name: "Pendapatan Harian",
      date: todayDate,
      amount: form.amount.trim().startsWith("Rp") ? form.amount.trim() : `Rp ${Number(form.amount).toLocaleString("id-ID")}`,
      keterangan: form.keterangan,
      status: "Lunas",
    });

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setForm(initialForm);
    setShowForm(false);
    setMessage("");
    setToast("Pendapatan harian berhasil ditambahkan. Total pendapatan diperbarui.");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl bg-slate-900 text-white px-5 py-3 text-sm font-semibold shadow-lg">
          {toast}
        </div>
      )}

      <PageHeader title="Keuangan & Pendapatan" subtitle="Catat pendapatan harian dan pantau total" showSearch={false} />

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
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="month" className="text-sm font-semibold text-slate-700">
              Bulan
            </label>
            <input
              id="month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-xl border px-4 py-2"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowForm((p) => !p)}
            className="rounded-xl bg-[#1565C0] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0f4d8a]"
          >
            {showForm ? "Tutup Form" : "+ Tambah Pendapatan Harian"}
          </button>
        </div>

        {message && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{message}</div>
        )}

        {showForm && (
          <div className="rounded-2xl border bg-gray-50 p-6">
            <h2 className="text-lg font-semibold mb-4">Form Tambah Pendapatan Harian</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Tanggal</label>
                <input
                  type="date"
                  value={todayDate}
                  disabled
                  className="w-full px-4 py-2.5 border rounded-xl bg-white/70"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Total Pendapatan Harian</label>
                <input
                  type="text"
                  value={form.amount || ""}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="Contoh: 50000 atau Rp 50.000"
                  className="w-full px-4 py-2.5 border rounded-xl"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Keterangan (Opsional)</label>
                <input
                  type="text"
                  value={form.keterangan || ""}
                  onChange={(e) => handleInputChange("keterangan", e.target.value)}
                  placeholder="Catatan pendapatan"
                  className="w-full px-4 py-2.5 border rounded-xl"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3 rounded-xl border font-semibold">
                Batal
              </button>
              <button type="button" onClick={handleSave} className="px-5 py-3 rounded-xl bg-[#1565C0] text-white font-semibold">
                Simpan Pendapatan
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                {["Tanggal", "Nominal", "Keterangan"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {monthRecords.length > 0 ? (
                monthRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm">{item.date}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-green-700">{item.amount}</td>
                    <td className="px-4 py-4 text-sm">{item.keterangan || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-14 text-center text-gray-500">
                    Tidak ada pendapatan untuk bulan ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
