import React, { useEffect, useMemo, useState } from "react";
import pelangganData from "../../data/pelangganData.json";
import StatusBadge from "../../components/StatusBadge";

function parseTotalToNumber(totalText) {
  // expected examples: "Rp 21.000" or "Rp 120.000"
  const raw = String(totalText ?? "").replace(/[^0-9]/g, "");
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

export default function RiwayatTransaksi() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("tanggal"); // kode | tanggal | total
  const [sortDir, setSortDir] = useState("desc"); // asc | desc
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [orders, setOrders] = useState(pelangganData.orders);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const statusOptions = useMemo(() => {
    const set = new Set((pelangganData.orders || []).map((o) => o.status));
    return Array.from(set);
  }, []);

  useEffect(() => {
    // Reset to first page when filters change
    setPage(1);
  }, [query, statusFilter, sortBy, sortDir]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (orders || []).filter((order) => {
      const matchQuery =
        !q ||
        [order.kode, order.layanan, order.tanggal, order.total]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      const matchStatus = statusFilter === "all" ? true : order.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [orders, query, statusFilter]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    const copy = [...filtered];

    copy.sort((a, b) => {
      if (sortBy === "kode") {
        return String(a.kode).localeCompare(String(b.kode)) * dir;
      }
      if (sortBy === "total") {
        return (parseTotalToNumber(a.total) - parseTotalToNumber(b.total)) * dir;
      }
      // tanggal (string; best-effort)
      const da = Date.parse(a.tanggal);
      const db = Date.parse(b.tanggal);
      const na = Number.isFinite(da) ? da : 0;
      const nb = Number.isFinite(db) ? db : 0;
      return (na - nb) * dir;
    });

    return copy;
  }, [filtered, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageItems = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  };

  const openDetail = (order) => setSelectedOrder(order);

  const canConfirmReceipt = selectedOrder?.status === "Siap Diantar" || selectedOrder?.status === "Selesai";

  const onConfirmReceipt = () => {
    // UI-only: move status forward
    const current = selectedOrder;
    if (!current) return;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.kode !== current.kode) return o;
        if (o.status === "Selesai") return o;
        return { ...o, status: "Selesai" };
      })
    );

    setConfirmOpen(false);
    setSelectedOrder((prev) => (prev ? { ...prev, status: "Selesai" } : prev));
  };

  const skeletonRow = (
    <tr className="border-t">
      {["Kode", "Layanan", "Tanggal", "Total", "Status"].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200/70 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-inter-semibold text-gray-800">Riwayat Transaksi</h2>
            <p className="text-sm text-gray-500 mt-1 font-poppins">Cari, filter, dan urutkan pesanan Anda dengan cepat.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-60 max-w-full">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari kode, layanan, tanggal..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter shadow-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter bg-white shadow-sm"
              aria-label="Filter status"
            >
              <option value="all">Semua Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  <button className="hover:text-[#1565C0] transition-colors" onClick={() => toggleSort("kode")}>
                    Kode {sortBy === "kode" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Layanan
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  <button className="hover:text-[#1565C0] transition-colors" onClick={() => toggleSort("tanggal")}>
                    Tanggal {sortBy === "tanggal" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  <button className="hover:text-[#1565C0] transition-colors" onClick={() => toggleSort("total")}>
                    Total {sortBy === "total" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: pageSize }).map((_, idx) => <React.Fragment key={idx}>{skeletonRow}</React.Fragment>)
              ) : pageItems.length > 0 ? (
                pageItems.map((order) => (
                  <tr
                    key={order.kode}
                    className="border-t hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => openDetail(order)}
                  >
                    <td className="px-6 py-4 text-sm font-inter-semibold text-gray-800">{order.kode}</td>
                    <td className="px-6 py-4 text-sm font-inter-medium text-gray-700">{order.layanan}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-poppins">{order.tanggal}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-poppins">{order.total}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-14">
                    <div className="flex flex-col items-center justify-center text-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">📭</div>
                      <p className="text-gray-600 font-poppins">Tidak ada data untuk filter ini.</p>
                      <p className="text-sm text-gray-500 font-poppins">Coba ubah kata kunci atau status.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-gray-600 font-poppins">
            Menampilkan {sorted.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} dari {sorted.length} pesanan
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-inter-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sebelumnya
            </button>

            <span className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-inter-semibold text-blue-700">
              {page}/{totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-inter-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative max-w-3xl mx-auto mt-14">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="px-6 py-5 border-b bg-linear-to-r from-gray-50 to-white flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-inter-semibold text-xl text-gray-800">Detail Pesanan {selectedOrder.kode}</h3>
                  <p className="text-sm text-gray-500 mt-1 font-poppins">{selectedOrder.layanan} • {selectedOrder.tanggal}</p>
                </div>
                <button
                  className="p-2 rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedOrder(null)}
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 p-4 bg-gray-50">
                  <p className="text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">Total Biaya</p>
                  <p className="mt-2 text-2xl font-inter-semibold text-gray-900">{selectedOrder.total}</p>
                  <p className="mt-1 text-sm text-gray-600 font-poppins">Berat: {selectedOrder.berat || "-"}</p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4 bg-gray-50">
                  <p className="text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">Status</p>
                  <div className="mt-3">
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <div className="mt-3 text-sm text-gray-600 font-poppins">
                    {selectedOrder.status === "Diproses" && "Pesanan sedang diproses di laundry."}
                    {selectedOrder.status === "Dijemput" && "Kurir sedang menjemput pesanan."}
                    {selectedOrder.status === "Sedang Dicuci" && "Laundry sedang dalam tahap pencucian."}
                    {selectedOrder.status === "Sedang Disetrika" && "Laundry sedang disetrika."}
                    {selectedOrder.status === "Siap Diantar" && "Pesanan siap diantar ke alamat pelanggan."}
                    {selectedOrder.status === "Selesai" && "Pesanan telah selesai dan diterima."}
                  </div>
                </div>

                {/* Timeline status laundry (simple) */}
                <div className="md:col-span-2">
                  <div className="bg-white border border-gray-100 rounded-xl p-4">
                    <p className="text-sm font-inter-semibold text-gray-800 mb-3">Timeline Status</p>
                    <div className="space-y-3">
                      {[
                        { label: "Pesanan Dibuat", key: "Pesanan Dibuat" },
                        { label: "Dijemput Kurir", key: "Dijemput Kurir" },
                        { label: "Sedang Dicuci", key: "Sedang Dicuci" },
                        { label: "Sedang Disetrika", key: "Sedang Disetrika" },
                        { label: "Siap Diantar", key: "Siap Diantar" },
                        { label: "Selesai", key: "Selesai" },
                      ].map((step, idx) => {
                        const orderStatus = selectedOrder.status;
                        const completedMap = {
                          "Pesanan Dibuat": ["Pesanan Dibuat"],
                        };
                        // fallback: derive progress from status string
                        const statusRank = {
                          "Diproses": 1,
                          "Dijemput": 2,
                          "Sedang Dicuci": 2,
                          "Sedang Disetrika": 3,
                          "Siap Diantar": 4,
                          "Selesai": 5,
                          "Dijemput Kurir": 1,
                          "Pesanan Dibuat": 0,
                        };
                        const currentRank = statusRank[orderStatus] ?? 0;
                        const stepRank = idx; // 0..5
                        const done = currentRank >= stepRank;
                        const active = !done && stepRank === Math.min(currentRank + 1, 5);

                        return (
                          <div key={step.key} className="flex items-start gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-inter-semibold shrink-0 border transition-all ${
                                done
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : active
                                  ? "bg-blue-100 text-blue-700 border-blue-200 animate-pulse"
                                  : "bg-gray-100 text-gray-400 border-gray-200"
                              }`}
                            >
                              {done ? "✓" : idx + 1}
                            </div>
                            <div className="flex-1">
                              <p className={`font-inter-semibold ${done ? "text-green-700" : active ? "text-blue-700" : "text-gray-700"}`}>{step.label}</p>
                              <p className={`text-sm ${done ? "text-green-600" : active ? "text-blue-600" : "text-gray-500"}`}>
                                {done ? "Selesai" : active ? "Sedang berlangsung" : "Menunggu"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="text-sm text-gray-600 font-poppins">
                  Klik tombol di bawah untuk konfirmasi penerimaan (jika sudah diantar).
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-inter-semibold"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Tutup
                  </button>

                  <button
                    disabled={!canConfirmReceipt}
                    onClick={() => setConfirmOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#1565C0] text-white hover:bg-[#0f4d8a] transition-colors font-inter-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Konfirmasi Penerimaan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm dialog */}
      {confirmOpen && selectedOrder && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
          <div className="relative max-w-md mx-auto mt-28">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b bg-gradient-to-r from-gray-50 to-white">
                <h4 className="font-inter-semibold text-lg text-gray-900">Konfirmasi penerimaan</h4>
                <p className="text-sm text-gray-600 mt-1 font-poppins">
                  Apakah Anda yakin menerima pesanan {selectedOrder.kode}?
                </p>
              </div>

              <div className="px-6 py-5">
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                  <p className="text-sm text-blue-800 font-poppins">
                    Status akan diperbarui menjadi <span className="font-inter-semibold">Selesai</span>.
                  </p>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-inter-semibold"
                    onClick={() => setConfirmOpen(false)}
                  >
                    Batal
                  </button>
                  <button
                    className="flex-1 px-5 py-2.5 rounded-xl bg-[#1565C0] text-white hover:bg-[#0f4d8a] transition-colors font-inter-semibold"
                    onClick={onConfirmReceipt}
                  >
                    Ya, terima
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

