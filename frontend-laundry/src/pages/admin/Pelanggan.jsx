import { useMemo, useState } from "react";
import PageHeader from "../../DashboardAdmin/components/PageHeader";
import { useData } from "../../context/DataContext";

const initialForm = { name: "", address: "", phone: "", email: "" };

export default function Pelanggan() {
  const { customers, addCustomer, getCustomerById } = useData();
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const pageSize = 6;

  const filteredCustomers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      [c.name, c.address, c.phone, c.email, c.id].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [customers, query]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const visibleCustomers = filteredCustomers.slice((page - 1) * pageSize, page * pageSize);

  const handleSave = () => {
    const result = addCustomer(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setForm(initialForm);
    setShowForm(false);
    setMessage("Pelanggan berhasil ditambahkan.");
    setTimeout(() => setMessage(""), 3000);
  };

  const openDetail = (customer) => {
    const fresh = getCustomerById(customer.id);
    if (!fresh) {
      setError("Data pelanggan tidak ditemukan.");
      return;
    }
    setSelected(fresh);
    setError("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Pelanggan"
        subtitle="Lihat dan kelola data pelanggan"
        showSearch
        searchValue={query}
        onSearchChange={setQuery}
        showAdd
        addText={showForm ? "Tutup Form" : "Tambah Pelanggan"}
        onAdd={() => setShowForm((p) => !p)}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}
      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>
      )}

      {showForm && (
        <div className="rounded-3xl border bg-white shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Tambah Pelanggan</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Nama", field: "name", type: "text" },
              { label: "Telepon", field: "phone", type: "tel" },
              { label: "Email", field: "email", type: "email" },
              { label: "Alamat", field: "address", type: "text" },
            ].map((item) => (
              <div key={item.field}>
                <label className="block text-sm font-semibold mb-2">{item.label}</label>
                <input
                  type={item.type}
                  value={form[item.field]}
                  onChange={(e) => setForm((p) => ({ ...p, [item.field]: e.target.value }))}
                  className="w-full px-4 py-3 border rounded-2xl"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3 rounded-2xl border font-semibold">Batal</button>
            <button type="button" onClick={handleSave} className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-semibold">Simpan</button>
          </div>
        </div>
      )}

      <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b bg-slate-50">
          <h2 className="text-lg font-semibold">Daftar Pelanggan ({filteredCustomers.length})</h2>
        </div>

        {filteredCustomers.length === 0 ? (
          <p className="px-6 py-14 text-center text-slate-500">Data pelanggan tidak ditemukan.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    {["ID", "Nama", "Email", "Telepon", "Alamat", "Aksi"].map((h) => (
                      <th key={h} className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {visibleCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-semibold">{customer.id}</td>
                      <td className="px-6 py-4 text-sm">{customer.name}</td>
                      <td className="px-6 py-4 text-sm">{customer.email}</td>
                      <td className="px-6 py-4 text-sm">{customer.phone}</td>
                      <td className="px-6 py-4 text-sm">{customer.address}</td>
                      <td className="px-6 py-4">
                        <button type="button" onClick={() => openDetail(customer)} className="text-sm text-[#1565C0] font-semibold hover:underline">
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t flex justify-between">
              <p className="text-sm text-slate-500">Halaman {page} dari {totalPages}</p>
              <div className="flex gap-2">
                <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 border rounded-2xl disabled:opacity-50">Sebelumnya</button>
                <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 border rounded-2xl disabled:opacity-50">Berikutnya</button>
              </div>
            </div>
          </>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative max-w-md mx-auto mt-24 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-semibold text-xl">Detail Pelanggan</h3>
              <div className="mt-5 space-y-3 text-sm">
                <p><span className="text-gray-500">ID:</span> {selected.id}</p>
                <p><span className="text-gray-500">Nama:</span> {selected.name}</p>
                <p><span className="text-gray-500">Email:</span> {selected.email}</p>
                <p><span className="text-gray-500">Telepon:</span> {selected.phone}</p>
                <p><span className="text-gray-500">Alamat:</span> {selected.address}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="mt-6 w-full py-2.5 rounded-xl border font-semibold hover:bg-gray-50">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
