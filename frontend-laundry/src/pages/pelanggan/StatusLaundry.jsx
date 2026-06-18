import { useMemo, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoEllipseOutline,
  IoTimeOutline,
} from "react-icons/io5";
import pelangganData from "../../data/pelangganData.json";
import StatusBadge from "../../components/StatusBadge";

const TIMELINE_STEPS = [
  "Pesanan Dibuat",
  "Dijemput Kurir",
  "Sedang Dicuci",
  "Sedang Disetrika",
  "Siap Diantar",
  "Selesai",
];

const statusRank = {
  Diproses: 0,
  Dijemput: 1,
  "Dijemput Kurir": 1,
  "Sedang Dicuci": 2,
  "Sedang Disetrika": 3,
  "Siap Diantar": 4,
  Selesai: 5,
};

function getStepStatus(stepIndex, currentRank) {
  if (currentRank >= stepIndex) return "completed";
  if (stepIndex === currentRank + 1) return "active";
  return "pending";
}

export default function StatusLaundry() {
  const [selectedKode, setSelectedKode] = useState(pelangganData.orders[0]?.kode || "");

  const selectedOrder = useMemo(
    () => pelangganData.orders.find((o) => o.kode === selectedKode),
    [selectedKode]
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

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <label className="block text-sm font-inter-semibold text-gray-700 mb-2">Pilih Pesanan</label>
        <select
          value={selectedKode}
          onChange={(e) => setSelectedKode(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-200 font-inter bg-white"
        >
          {pelangganData.orders.map((order) => (
            <option key={order.kode} value={order.kode}>
              {order.kode} — {order.layanan} ({order.status})
            </option>
          ))}
        </select>
      </div>

      {selectedOrder && (
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-inter-semibold text-2xl text-gray-800">Status Pesanan Laundry</h2>
              <p className="text-sm text-gray-500 mt-2">
                {selectedOrder.kode} — {selectedOrder.layanan}
              </p>
            </div>
            <StatusBadge status={selectedOrder.status} />
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#3b6fd8] to-[#1565C0] rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right">
              {currentRank + 1} dari {TIMELINE_STEPS.length} tahap
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.status === "completed";
              const isActive = step.status === "active";
              const isPending = step.status === "pending";

              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-green-100 text-green-600"
                          : isActive
                          ? "bg-blue-100 text-blue-600 animate-pulse"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Icon className="text-xl" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-1 h-16 mt-2 transition-colors ${isCompleted ? "bg-green-300" : "bg-gray-200"}`} />
                    )}
                  </div>

                  <div className="flex-1 pt-2">
                    <div className="bg-linear-to-r from-gray-50 to-white border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3
                            className={`font-inter-semibold text-lg ${
                              isCompleted ? "text-green-700" : isActive ? "text-blue-700" : "text-gray-600"
                            }`}
                          >
                            {step.label}
                          </h3>
                          <p className={`text-sm mt-1 ${isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-500"}`}>
                            {isCompleted && "✓ Selesai"}
                            {isActive && "⏳ Sedang berlangsung..."}
                            {isPending && "Menunggu"}
                          </p>
                        </div>
                        {isCompleted && (
                          <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-inter-semibold">Selesai</span>
                        )}
                        {isActive && (
                          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-inter-semibold animate-pulse">Proses</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-blue-600 font-inter-semibold uppercase">Detail Biaya</p>
              <p className="text-xl font-inter-semibold text-blue-900 mt-1">{selectedOrder.total}</p>
              <p className="text-sm text-blue-700 mt-1">Berat: {selectedOrder.berat}</p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
              <p className="text-xs text-gray-600 font-inter-semibold uppercase">Alamat</p>
              <p className="text-sm text-gray-800 mt-1 font-poppins">{selectedOrder.alamat}</p>
              <p className="text-xs text-gray-500 mt-2">Layanan: {selectedOrder.pengantaran === "jemput" ? "Jemput ke Rumah" : "Antar ke Laundry"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
