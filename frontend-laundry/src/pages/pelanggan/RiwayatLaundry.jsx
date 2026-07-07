import React, { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import StatusBadge from "../../components/StatusBadge";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { formatRupiah } from "../../lib/constants";

  // For riwayat, statuses simplified to Diantar / Belum Diantar and 'Diterima Pelanggan'

function getStepStatus(stepIndex, currentRank) {
  if (currentRank >= stepIndex) return "completed";
  if (stepIndex === currentRank + 1) return "active";
  return "pending";
}

function formatWaktu(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
}

function buildTimeline(order) {
  const steps = [
    { id: "order", title: "Pesanan dibuat", time: formatWaktu(order.createdAt), done: true },
    {
      id: "schedule",
      title: "Jadwal dipilih",
      time: order.tanggal ? `${order.tanggal} pukul ${order.jam}` : "Belum dipilih",
      done: Boolean(order.slotId),
    },
    { id: "process", title: "Laundry diproses", done: !["Diproses"].includes(order.status) },
    { id: "delivery", title: "Laundry diantar", done: ["Diantar", "Selesai"].includes(order.status) },
  ];

  if (order.bukti?.foto) {
    steps.push({
      id: "proof",
      title: "Bukti pengantaran",
      time: formatWaktu(order.bukti.waktu),
      description: order.bukti.catatan || `Diantar oleh ${order.bukti.kurirNama || "Kurir"}`,
      image: order.bukti.foto,
      done: true,
    });
  } else {
    steps.push({ id: "proof", title: "Menunggu bukti pengantaran", done: false });
  }

  return steps;
}

function BiayaSection({ order }) {
  if (order.berat == null) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
        <StatusBadge status="Menunggu Penimbangan" />
        <p className="mt-2 text-sm text-orange-800">Berat laundry belum ditimbang oleh pemilik.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-green-100 bg-green-50 p-4 space-y-2">
      <p className="text-sm font-inter-semibold text-green-900">Rincian Biaya</p>
      <p className="text-sm text-green-800">
        {order.berat} Kg × Rp {order.tarifPerKg.toLocaleString("id-ID")}/Kg ={" "}
        <strong>{formatRupiah(order.total)}</strong>
      </p>
    </div>
  );
}

export default function RiwayatLaundry() {
  const { user } = useAuth();
  const { getOrdersForCustomer } = useData();
  const orders = getOrdersForCustomer(user.customerId);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedKode, setSelectedKode] = useState(orders[0]?.id || "");

  const statusOptions = ["all", "Diantar", "Belum Diantar"];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchQuery = !q || [order.id, order.layananLabel].filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
      const isDiantar = order.status === "Diantar" || order.status === "Selesai" || order.status === "Diterima Pelanggan";
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "Diantar" && isDiantar) ||
        (statusFilter === "Belum Diantar" && !isDiantar);
      return matchQuery && matchStatus;
    });
  }, [orders, query, statusFilter]);

  const selectedOrder = useMemo(() => orders.find((o) => o.id === selectedKode), [orders, selectedKode]);
  const timelineItems = useMemo(() => (selectedOrder ? buildTimeline(selectedOrder) : []), [selectedOrder]);

  if (orders.length === 0) {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-4 py-12">
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-600 font-poppins">Tidak ada data pesanan.</p>
            <p className="text-sm text-gray-500 mt-2">Buat pesanan laundry terlebih dahulu.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header and Riwayat Table */}
      <Card>
        <CardHeader
          title="Riwayat Laundry"
          subtitle="Lihat semua pesanan, status, dan bukti pengantaran"
        />
        <CardBody className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kode, layanan..."
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 flex-1"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white"
            >
              <option value="all">Semua Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Kode', 'Layanan', 'Biaya', 'Status', 'Bukti'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((order) => (
                    <tr key={order.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedKode(order.id)}>
                      <td className="px-6 py-4 text-sm font-semibold">{order.id}</td>
                      <td className="px-6 py-4 text-sm">{order.layananLabel}</td>
                      <td className="px-6 py-4 text-sm">{order.berat != null ? formatRupiah(order.total) : <StatusBadge status="Menunggu Penimbangan" />}</td>
                      <td className="px-6 py-4 text-sm">{order.status === 'Diantar' || order.status === 'Diterima Pelanggan' ? 'Diantar' : 'Belum Diantar'}</td>
                      <td className="px-6 py-4 text-sm">
                        {order.bukti?.foto ? (
                          <button className="text-sm text-blue-600 underline" onClick={(e) => { e.stopPropagation(); window.open(order.bukti.foto, '_blank'); }}>Lihat Foto Bukti Pengantaran</button>
                        ) : (
                          <span className="text-xs text-gray-500">Belum ada</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center text-gray-500">Tidak ada data untuk filter ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Detailed view removed per requirement; only the table is shown */}
    </div>
  );
}
