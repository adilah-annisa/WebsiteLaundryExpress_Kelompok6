import { useMemo, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoEllipseOutline,
  IoTimeOutline,
  IoMapOutline,
} from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import StatusBadge from "../../components/StatusBadge";
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

export default function StatusLaundry() {
  const { user } = useAuth();
  const { getOrdersForCustomer } = useData();
  const orders = getOrdersForCustomer(user.customerId);

  const [selectedKode, setSelectedKode] = useState(orders[0]?.id || "");

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedKode),
    [orders, selectedKode]
  );

  if (orders.length === 0) {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-12">
          <p className="text-gray-600 font-poppins">Data pesanan tidak ditemukan.</p>
          <p className="text-sm text-gray-500 mt-2">Buat pesanan laundry terlebih dahulu.</p>
        </div>
      </div>
    );
  }

  const currentRank = statusRank[selectedOrder?.status] ?? 0;
  const progressPercent = Math.round(((currentRank + 1) / TIMELINE_STEPS.length) * 100);

  const steps = TIMELINE_STEPS.map((label, index) => {
    const status = getStepStatus(index, currentRank);
    const icon =
      status === "completed" ? IoCheckmarkCircleOutline : status === "active" ? IoTimeOutline : IoEllipseOutline;
    return { label, status, icon };
  });

  return (
    <div className="w-full max-w-screen-xl mx-auto min-h-screen space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-5 xl:grid-cols-[1.2fr_minmax(240px,320px)] items-start">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-inter-semibold text-slate-900">Status Laundry</h1>
          <p className="mt-2 text-sm text-slate-500">Pilih pesanan untuk melihat status terkini.</p>

          <div className="mt-6">
            <label className="block text-sm font-inter-semibold text-gray-700 mb-2">Pilih Pesanan</label>
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
        </div>

        {selectedOrder && (
          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="font-inter-semibold">{selectedOrder.id}</p>
                <StatusBadge status={selectedOrder.status} />
              </div>
              <p className="mt-2 text-sm text-slate-500">{progressPercent}% progres</p>
              <BiayaSection order={selectedOrder} />
            </div>
          </aside>
        )}
      </div>

      {selectedOrder && (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 flex items-start gap-3">
              <IoMapOutline className="text-xl text-slate-600 mt-1" />
              <div>
                <p className="text-xs uppercase text-slate-500">Alamat</p>
                <p className="font-semibold text-slate-900">{selectedOrder.alamat}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 flex items-start gap-3">
              <IoTimeOutline className="text-xl text-slate-600 mt-1" />
              <div>
                <p className="text-xs uppercase text-slate-500">Jadwal</p>
                <p className="font-semibold text-slate-900">
                  {selectedOrder.tanggal ? `${selectedOrder.tanggal} ${selectedOrder.jam}` : "Belum dipilih"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.status === "active";
              const isCompleted = step.status === "completed";
              return (
                <div
                  key={index}
                  className={`rounded-2xl border p-4 ${isActive ? "border-blue-200 bg-blue-50" : "border-gray-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`text-xl ${isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-400"}`} />
                    <div>
                      <p className="font-inter-semibold">{step.label}</p>
                      <p className="text-sm text-slate-500">
                        {isCompleted ? "Selesai" : isActive ? "Sedang berlangsung" : "Menunggu"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
