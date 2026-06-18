import React, { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import StatusBadge from "../../components/StatusBadge";
import { formatRupiah } from "../../lib/constants";

export default function RiwayatTransaksi() {
  const { user } = useAuth();
  const { getOrdersForCustomer } = useData();
  const orders = getOrdersForCustomer(user.customerId);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusOptions = useMemo(() => {
    return Array.from(new Set(orders.map((o) => o.status)));
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchQuery =
        !q ||
        [order.id, order.layananLabel, order.tanggal, order.status]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      const matchStatus = statusFilter === "all" || order.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [orders, query, statusFilter]);

  if (orders.length === 0) {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 font-poppins">Tidak ada data pesanan.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto space-y-4">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-inter-semibold text-gray-800">Riwayat Pesanan</h2>
            <p className="text-sm text-gray-500 mt-1">Klik baris untuk melihat detail biaya.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kode, layanan..."
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 w-56"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white"
            >
              <option value="all">Semua Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Kode", "Layanan", "Tanggal", "Biaya", "Status"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4 text-sm font-semibold">{order.id}</td>
                    <td className="px-6 py-4 text-sm">{order.layananLabel}</td>
                    <td className="px-6 py-4 text-sm">{order.tanggal || order.createdAt}</td>
                    <td className="px-6 py-4 text-sm">
                      {order.berat != null ? formatRupiah(order.total) : (
                        <StatusBadge status="Menunggu Penimbangan" />
                      )}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-gray-500">
                    Tidak ada data untuk filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedOrder(null)} />
          <div className="relative max-w-lg mx-auto mt-20 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-semibold text-xl">Detail Pesanan {selectedOrder.id}</h3>
              <p className="text-sm text-gray-500 mt-1">{selectedOrder.layananLabel}</p>

              <div className="mt-5 space-y-3">
                <p className="text-sm"><span className="text-gray-500">Status:</span> <StatusBadge status={selectedOrder.status} /></p>
                {selectedOrder.berat == null ? (
                  <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                    <StatusBadge status="Menunggu Penimbangan" />
                    <p className="text-sm text-orange-800 mt-2">Berat belum diinput oleh pemilik laundry.</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                    <p className="text-sm font-semibold text-green-900">Rincian Biaya</p>
                    <p className="text-sm text-green-800 mt-1">
                      {selectedOrder.berat} Kg × Rp {selectedOrder.tarifPerKg.toLocaleString("id-ID")}/Kg ={" "}
                      <strong>{formatRupiah(selectedOrder.total)}</strong>
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="mt-6 w-full rounded-xl border border-gray-200 py-2.5 font-semibold hover:bg-gray-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
