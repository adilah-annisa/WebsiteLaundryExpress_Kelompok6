import React, { useMemo, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoEllipseOutline,
  IoTimeOutline,
  IoMapOutline,
  IoImageOutline,
} from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import StatusBadge from "../../components/StatusBadge";
import Timeline from "../../components/Timeline";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import { formatRupiah } from "../../lib/constants";

const TIMELINE_STEPS = [
  "Diproses",
  "Dijemput",
  "Sedang Dicuci",
  "Sedang Disetrika",
  "Siap Diantar",
  "Diantar",
  "Selesai",
];

const statusRank = {
  Diproses: 0,
  Dijemput: 1,
  "Sedang Dicuci": 2,
  "Sedang Disetrika": 3,
  "Siap Diantar": 4,
  Diantar: 5,
  Selesai: 6,
};

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

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedKode),
    [orders, selectedKode]
  );

  const timelineItems = useMemo(
    () => (selectedOrder ? buildTimeline(selectedOrder) : []),
    [selectedOrder]
  );

  const currentRank = statusRank[selectedOrder?.status] ?? 0;
  const progressPercent = Math.round(((currentRank + 1) / TIMELINE_STEPS.length) * 100);

  const steps = TIMELINE_STEPS.map((label, index) => {
    const status = getStepStatus(index, currentRank);
    const icon =
      status === "completed"
        ? IoCheckmarkCircleOutline
        : status === "active"
        ? IoTimeOutline
        : IoEllipseOutline;
    return { label, status, icon };
  });

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
                  {["Kode", "Layanan", "Tanggal", "Biaya", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedKode(order.id)}
                    >
                      <td className="px-6 py-4 text-sm font-semibold">{order.id}</td>
                      <td className="px-6 py-4 text-sm">{order.layananLabel}</td>
                      <td className="px-6 py-4 text-sm">{order.tanggal || order.createdAt}</td>
                      <td className="px-6 py-4 text-sm">
                        {order.berat != null ? (
                          formatRupiah(order.total)
                        ) : (
                          <StatusBadge status="Menunggu Penimbangan" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-14 text-center text-gray-500"
                    >
                      Tidak ada data untuk filter ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Detailed View */}
      {selectedOrder && (
        <>
          {/* Status Progress and Biaya */}
          <div className="grid gap-5 xl:grid-cols-[1.2fr_minmax(240px,320px)] items-start">
            <Card>
              <CardHeader
                title="Status & Detail"
                subtitle={`Pesanan ${selectedOrder.id}`}
              />
              <CardBody className="space-y-6">
                <div>
                  <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
                    Pilih Pesanan Lain
                  </label>
                  <select
                    value={selectedKode}
                    onChange={(e) => setSelectedKode(e.target.value)}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-200 bg-white"
                  >
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.id} — {order.layananLabel} ({order.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4 flex items-start gap-3">
                    <IoMapOutline className="text-xl text-slate-600 mt-1" />
                    <div>
                      <p className="text-xs uppercase text-slate-500">Alamat</p>
                      <p className="font-semibold text-slate-900">
                        {selectedOrder.alamat}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 flex items-start gap-3">
                    <IoTimeOutline className="text-xl text-slate-600 mt-1" />
                    <div>
                      <p className="text-xs uppercase text-slate-500">Jadwal</p>
                      <p className="font-semibold text-slate-900">
                        {selectedOrder.tanggal
                          ? `${selectedOrder.tanggal} ${selectedOrder.jam}`
                          : "Belum dipilih"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline Steps */}
                <div>
                  <p className="text-sm font-inter-semibold mb-4">Tahapan Pesanan</p>
                  <div className="space-y-2">
                    {steps.map((step, idx) => {
                      const Icon = step.icon;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-2 rounded-lg ${
                            step.status === "completed"
                              ? "bg-green-50"
                              : step.status === "active"
                              ? "bg-blue-50"
                              : "bg-gray-50"
                          }`}
                        >
                          <Icon
                            className={`text-lg ${
                              step.status === "completed"
                                ? "text-green-600"
                                : step.status === "active"
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardBody>
            </Card>

            <aside className="space-y-4">
              <Card>
                <CardHeader title="Ringkasan" />
                <CardBody className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-inter-semibold">{selectedOrder.id}</p>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <p className="text-sm text-slate-500">{progressPercent}% progres</p>
                  <BiayaSection order={selectedOrder} />
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-slate-500">Jenis Layanan</p>
                    <p className="text-sm font-semibold mt-1">
                      {selectedOrder.pengantaran === "jemput"
                        ? "Jemput ke Rumah"
                        : selectedOrder.pengantaran === "antar"
                        ? "Antar ke Laundry"
                        : "Antar-Jemput"}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </aside>
          </div>

          {/* Timeline & Bukti */}
          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader
                title="Timeline Lengkap"
                subtitle="Kronologi dan bukti pengantaran"
              />
              <CardBody>
                {!selectedOrder.bukti?.foto && (
                  <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <p className="text-sm text-blue-800">
                      <IoImageOutline className="inline mr-2" />
                      Menunggu bukti pengantaran dari kurir...
                    </p>
                  </div>
                )}
                <Timeline items={timelineItems} />
              </CardBody>
            </Card>

            <Card className="h-fit">
              <CardHeader title="Info Pesanan" />
              <CardBody className="space-y-3 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">Kode</span>
                  <span className="font-semibold">{selectedOrder.id}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">Layanan</span>
                  <span>{selectedOrder.layananLabel}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">Berat</span>
                  <span>
                    {selectedOrder.berat ? `${selectedOrder.berat} Kg` : "Belum ditimbang"}
                  </span>
                </div>
                <div className="flex justify-between gap-2 items-center">
                  <span className="text-slate-500">Status</span>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                {selectedOrder.bukti?.foto && (
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500">Waktu pengantaran</p>
                    <p className="font-semibold mt-1">
                      {formatWaktu(selectedOrder.bukti.waktu)}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Konfirmasi Penerimaan */}
          {selectedOrder.status === "Selesai" && selectedOrder.bukti?.foto && (
            <Card>
              <CardHeader title="Konfirmasi Penerimaan" />
              <CardBody className="space-y-4">
                <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
                  <p className="text-sm text-green-900 font-semibold">
                    ✓ Laundry telah diterima
                  </p>
                  <p className="text-xs text-green-800 mt-2">
                    Pesanan {selectedOrder.id} selesai pada{" "}
                    {formatWaktu(selectedOrder.bukti.waktu)}
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
