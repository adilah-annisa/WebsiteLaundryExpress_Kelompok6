import { useMemo, useState } from "react";
import pelangganData from "../../data/pelangganData.json";
import StatusBadge from "../../components/StatusBadge";

export default function JadwalPelanggan() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const statusOptions = ["all", "Selesai", "Diproses", "Dijemput", "Diantar"];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pelangganData.schedule.filter((item) => {
      const matchesQuery =
        !q ||
        [item.seri, item.name, item.date, item.berat, item.titik]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(q));
      const matchesStatus = statusFilter === "all" ? true : item.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
          <h2 className="text-xl font-inter-semibold text-gray-900">Jadwal Jemput Laundry</h2>
          <p className="mt-1 text-sm text-gray-500">Lihat jadwal dan status jemput untuk pesanan Anda.</p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-[1.6fr_1fr_0.9fr] items-center">
            <div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari kode, nama, tanggal..."
                className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "Semua Status" : status}
                </option>
              ))}
            </select>
            <div className="rounded-3xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Menampilkan {filtered.length} jadwal
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  {['Seri', 'Nama', 'Tanggal', 'Berat', 'Progress', 'Status'].map((label) => (
                    <th key={label} className="px-6 py-4 text-xs font-inter-semibold uppercase tracking-[0.18em] text-gray-500">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageItems.length > 0 ? (
                  pageItems.map((item) => (
                    <tr key={item.seri} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-inter-semibold text-gray-800">{item.seri}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.berat}</td>
                      <td className="px-6 py-4">
                        <div className="rounded-full bg-gray-100 h-2.5 overflow-hidden">
                          <div className="h-full rounded-full bg-linear-to-r from-blue-500 to-sky-500" style={{ width: item.titik }} />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">{item.titik} selesai</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-sm text-gray-500">
                      Tidak ada jadwal yang cocok. Ubah kata kunci atau filter status.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="rounded-3xl border border-gray-200 bg-white px-4 py-2 text-sm font-inter-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="rounded-3xl border border-gray-200 bg-white px-4 py-2 text-sm font-inter-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
