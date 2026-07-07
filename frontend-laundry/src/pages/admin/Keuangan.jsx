import { useMemo, useState } from "react";
import StatusBadge from "../../DashboardAdmin/components/StatusBadge";
import { useData } from "../../context/DataContext";
import { formatRupiah } from "../../lib/constants";
import Pagination from "../../components/ui/Pagination";

const initialForm = {
  amount: "",
  keterangan: "",
  paymentMethod: "Tunai",
  paymentStatus: "Lunas",
};

export default function Keuangan() {
  const { transactions, addTransaction } = useData();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const todayDate = new Date().toISOString().slice(0, 10);

  /* ================= DATA ================= */

  const monthRecords = useMemo(
    () => transactions.filter((t) => t.date?.slice(0, 7) === selectedMonth),
    [transactions, selectedMonth]
  );

  const cashMonthlyTotal = useMemo(
    () =>
      monthRecords
        .filter((t) => t.paymentMethod === "Tunai")
        .reduce((s, t) => s + (t.amountNum || 0), 0),
    [monthRecords]
  );

  const nonCashTransactions = useMemo(
    () =>
      monthRecords.filter(
        (t) => t.paymentMethod && t.paymentMethod !== "Tunai"
      ),
    [monthRecords]
  );

  const nonCashMonthlyTotal = useMemo(
    () =>
      nonCashTransactions.reduce((s, t) => s + (t.amountNum || 0), 0),
    [nonCashTransactions]
  );

  const filteredNonCash = useMemo(
    () =>
      nonCashTransactions.filter((item) => {
        if (!searchTerm) return true;
        const k = searchTerm.toLowerCase();
        return [item.name, item.paymentMethod, item.paymentStatus, item.date]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(k));
      }),
    [nonCashTransactions, searchTerm]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNonCash.length / rowsPerPage)
  );

  const pagedTransactions = useMemo(
    () =>
      filteredNonCash.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
      ),
    [filteredNonCash, page]
  );

  const summaryCards = [
    {
      label: "Non Tunai",
      value: formatRupiah(nonCashMonthlyTotal),
      color: "text-blue-600",
    },
    {
      label: "Tunai",
      value: formatRupiah(cashMonthlyTotal),
      color: "text-green-600",
    },
  ];

  /* ================= ACTION ================= */

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage("");
  };

  const handleSave = () => {
    if (!form.amount.trim()) {
      setMessage("Masukkan nominal dulu.");
      return;
    }

    const result = addTransaction({
      name: "Pendapatan Harian",
      date: todayDate,
      amount: form.amount.startsWith("Rp")
        ? form.amount
        : `Rp ${Number(form.amount).toLocaleString("id-ID")}`,
      paymentMethod: form.paymentMethod,
      paymentStatus: form.paymentStatus,
      keterangan: form.keterangan,
      status: form.paymentStatus,
    });

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setForm(initialForm);
    setShowForm(false);
    setToast("Berhasil ditambahkan!");
    setTimeout(() => setToast(""), 3000);
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-xl text-sm shadow">
          {toast}
        </div>
      )}

      {/* SUMMARY */}
      <div className="grid md:grid-cols-2 gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className="bg-white p-5 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className={`text-2xl font-bold mt-2 ${c.color}`}>
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* FILTER */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded-xl px-3 py-2"
        />

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          {showForm ? "Tutup" : "+ Tambah"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
          {message && <p className="text-red-500 text-sm">{message}</p>}

          <input
            type="date"
            value={todayDate}
            disabled
            className="border px-3 py-2 rounded-xl w-full"
          />

          <input
            type="text"
            placeholder="Nominal"
            value={form.amount}
            onChange={(e) =>
              handleInputChange("amount", e.target.value)
            }
            className="border px-3 py-2 rounded-xl w-full"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="border px-4 py-2 rounded-xl"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {/* TABLES SIDE BY SIDE */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* PENDAPATAN */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-4">
            Pendapatan Bulanan
          </h2>

          <div className="overflow-auto border rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Tanggal</th>
                  <th className="p-3 text-left">Nominal</th>
                  <th className="p-3 text-left">Ket</th>
                </tr>
              </thead>
              <tbody>
                {monthRecords.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-3">{item.date}</td>
                    <td className="p-3 text-green-600 font-semibold">
                      {item.amount}
                    </td>
                    <td className="p-3">
                      {item.keterangan || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NON TUNAI */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-4">
            Transaksi Non Tunai
          </h2>

          <input
            type="text"
            placeholder="Cari..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3 w-full border px-3 py-2 rounded-xl"
          />

          <div className="overflow-auto border rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Metode</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Nominal</th>
                </tr>
              </thead>

              <tbody>
                {pagedTransactions.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-3">{item.date}</td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">
                      {item.paymentMethod}
                    </td>
                    <td className="p-3">
                      <StatusBadge
                        status={item.paymentStatus}
                      />
                    </td>
                    <td className="p-3 font-semibold">
                      {item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
