import { useMemo, useState } from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

export default function JadwalPelanggan() {
  const { user } = useAuth();
  const { getOrdersForCustomer, slots, bookSlot } = useData();

  const orders = getOrdersForCustomer(user.customerId);
  const pendingOrders = orders.filter((o) => !o.slotId && o.status === "Diproses");

  const [selectedOrderId, setSelectedOrderId] = useState(pendingOrders[0]?.id || "");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const jenis = selectedOrder?.pengantaran === "antar" ? "antar" : "jemput";

  const availableSlots = useMemo(() => {
    return slots
      .filter((s) => s.jenis === jenis && s.terisi < s.kapasitas)
      .sort((a, b) => `${a.tanggal}${a.jam}`.localeCompare(`${b.tanggal}${b.jam}`));
  }, [slots, jenis]);

  const fullSlots = useMemo(() => {
    return slots.filter((s) => s.jenis === jenis && s.terisi >= s.kapasitas);
  }, [slots, jenis]);

  const handleBook = () => {
    setError("");
    setSuccess("");

    if (!selectedOrderId) {
      setError("Pilih pesanan terlebih dahulu.");
      return;
    }
    if (!selectedSlotId) {
      setError("Pilih slot jadwal yang tersedia.");
      return;
    }

    const slot = slots.find((s) => s.id === selectedSlotId);
    if (slot && slot.terisi >= slot.kapasitas) {
      setError("Slot penuh. Silakan pilih jadwal lain.");
      return;
    }

    const result = bookSlot(selectedOrderId, selectedSlotId);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSuccess(`Jadwal ${slot.tanggal} pukul ${slot.jam} berhasil dipilih untuk pesanan ${selectedOrderId}.`);
    setSelectedSlotId("");
    setTimeout(() => setSuccess(""), 5000);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
          <h2 className="text-xl font-inter-semibold text-gray-900">Pilih Jadwal Antar-Jemput</h2>
          <p className="mt-1 text-sm text-gray-500">Pilih slot waktu yang tersedia untuk pesanan Anda.</p>
        </div>

        <div className="px-6 py-5 space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
          )}
          {success && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 flex items-center gap-2">
              <IoCheckmarkCircleOutline className="text-lg" />
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-inter-semibold text-gray-700 mb-2">Pilih Pesanan</label>
            {pendingOrders.length === 0 ? (
              <p className="text-sm text-gray-500">Semua pesanan sudah memiliki jadwal, atau belum ada pesanan baru.</p>
            ) : (
              <select
                value={selectedOrderId}
                onChange={(e) => {
                  setSelectedOrderId(e.target.value);
                  setSelectedSlotId("");
                  setError("");
                }}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-200"
              >
                {pendingOrders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} — {o.layananLabel} ({o.pengantaran === "jemput" ? "Jemput" : "Antar"})
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedOrder && (
            <>
              <div>
                <h3 className="text-sm font-inter-semibold text-gray-700 mb-3">Slot Tersedia ({jenis === "jemput" ? "Penjemputan" : "Pengantaran"})</h3>
                {availableSlots.length === 0 ? (
                  <p className="text-sm text-gray-500">Tidak ada slot tersedia. Hubungi pemilik laundry.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          selectedSlotId === slot.id
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        <p className="font-inter-semibold text-gray-900">{slot.tanggal}</p>
                        <p className="text-sm text-gray-600 mt-1">Pukul {slot.jam}</p>
                        <p className="text-xs text-green-600 mt-2">
                          Tersedia {slot.kapasitas - slot.terisi} dari {slot.kapasitas}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {fullSlots.length > 0 && (
                <div>
                  <h3 className="text-sm font-inter-semibold text-gray-500 mb-2">Slot Penuh (tidak dapat dipilih)</h3>
                  <div className="flex flex-wrap gap-2">
                    {fullSlots.map((slot) => (
                      <span
                        key={slot.id}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 line-through"
                      >
                        {slot.tanggal} {slot.jam}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleBook}
                disabled={!selectedSlotId || pendingOrders.length === 0}
                className="rounded-2xl bg-[#1565C0] px-6 py-3 text-sm font-inter-semibold text-white hover:bg-[#0f4d8a] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Simpan Jadwal
              </button>
            </>
          )}

          <div className="border-t pt-5">
            <h3 className="text-sm font-inter-semibold text-gray-700 mb-3">Jadwal Pesanan Saya</h3>
            {orders.filter((o) => o.slotId).length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada jadwal terpilih.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Kode", "Layanan", "Tanggal", "Jam", "Status"].map((h) => (
                        <th key={h} className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders
                      .filter((o) => o.slotId)
                      .map((o) => (
                        <tr key={o.id}>
                          <td className="px-4 py-3 font-semibold">{o.id}</td>
                          <td className="px-4 py-3">{o.layananLabel}</td>
                          <td className="px-4 py-3">{o.tanggal}</td>
                          <td className="px-4 py-3">{o.jam}</td>
                          <td className="px-4 py-3">{o.status}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
