import { useMemo, useState } from "react";
import dashboardData from "../../data/dashboardData.json";
import PageHeader from "../../DashboardAdmin/components/PageHeader";

const initialForm = {
  id: "",
  name: "",
  address: "",
  phone: "",
  email: "",
};

export default function Pelanggan() {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [customers, setCustomers] = useState(dashboardData.customers || []);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const pageSize = 6;

  const filteredCustomers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((customer) =>
      [customer.name, customer.address, customer.phone, customer.email]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(q))
    );
  }, [customers, query]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const visibleCustomers = filteredCustomers.slice((page - 1) * pageSize, page * pageSize);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.name || !form.address || !form.phone || !form.email) {
      setMessage("Harap lengkapi semua data pelanggan.");
      return;
    }

    const newCustomer = {
      ...form,
      id: `C${String(customers.length + 1).padStart(3, "0")}`,
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    setForm(initialForm);
    setShowForm(false);
    setMessage("Pelanggan berhasil ditambahkan.");
    setPage(1);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Pelanggan"
        subtitle="Pantau data pelanggan dan tambahkan pelanggan baru dengan cepat"
        showSearch={true}
        searchValue={query}
        onSearchChange={setQuery}
        showAdd={true}
        addText={showForm ? "Tutup Form" : "Tambah Pelanggan"}
        onAdd={() => setShowForm((prev) => !prev)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-linear-to-br from-slate-50 to-white p-6 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 uppercase tracking-[0.2em] font-inter-semibold">
            Total Pelanggan
          </p>
          <p className="mt-4 text-4xl font-inter-semibold text-slate-900">{customers.length}</p>
          <p className="mt-2 text-sm text-slate-500">Jumlah pelanggan aktif yang tercatat.</p>
        </div>

        <div className="rounded-3xl bg-linear-to-br from-blue-50 to-white p-6 shadow-sm border border-blue-100">
          <p className="text-sm text-blue-600 uppercase tracking-[0.2em] font-inter-semibold">Pelanggan Baru</p>
          <p className="mt-4 text-4xl font-inter-semibold text-blue-900">{customers.filter((customer) => customer.id.endsWith("1")).length}</p>
          <p className="mt-2 text-sm text-blue-600">Contoh ringkasan untuk tahap grow customer.</p>
        </div>

        <div className="rounded-3xl bg-linear-to-br from-emerald-50 to-white p-6 shadow-sm border border-emerald-100">
          <p className="text-sm text-emerald-600 uppercase tracking-[0.2em] font-inter-semibold">Kualitas Layanan</p>
          <p className="mt-4 text-4xl font-inter-semibold text-emerald-900">95%</p>
          <p className="mt-2 text-sm text-emerald-600">Rata-rata kepuasan pelanggan di sistem.</p>
        </div>
      </div>

      {showForm && (
        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
            <div>
              <h2 className="text-xl font-inter-semibold text-slate-900">Tambah Pelanggan Baru</h2>
              <p className="text-sm text-slate-500">Isi informasi pelanggan untuk manajemen lebih mudah.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-inter-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Tutup Form
            </button>
          </div>

          {message && (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 mb-4">
              {message}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Nama Lengkap", field: "name", type: "text" },
              { label: "Nomor Telepon", field: "phone", type: "tel" },
              { label: "Email", field: "email", type: "email" },
              { label: "Alamat", field: "address", type: "text" },
            ].map((item) => (
              <div key={item.field}>
                <label className="block text-sm font-inter-semibold text-slate-600 mb-2">{item.label}</label>
                <input
                  type={item.type}
                  value={form[item.field]}
                  onChange={(e) => handleChange(item.field, e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-3xl border border-slate-200 px-5 py-3 text-sm font-inter-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-inter-semibold text-white hover:bg-slate-800 transition"
            >
              Simpan Pelanggan
            </button>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-inter-semibold text-slate-900">Daftar Pelanggan</h2>
          <p className="text-sm text-slate-500 mt-1">Filter pelanggan untuk menemukan data dengan cepat.</p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari pelanggan..."
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <p className="text-sm text-slate-500">Menampilkan {filteredCustomers.length} dari {customers.length} pelanggan</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                {['ID', 'Nama', 'Email', 'Telepon', 'Alamat'].map((label) => (
                  <th key={label} className="px-6 py-4 text-xs font-inter-semibold uppercase tracking-[0.2em] text-slate-500">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleCustomers.length > 0 ? (
                visibleCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-inter-semibold text-slate-900">{customer.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{customer.phone}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{customer.address}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-14 text-center text-slate-500">Tidak ada pelanggan yang sesuai.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Halaman {page} dari {totalPages}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-inter-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-inter-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
