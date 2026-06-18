import { useState } from "react";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoImageOutline,
  IoMapOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import StatusBadge from "../../components/StatusBadge";

function formatWaktu(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export default function BuktiPengantaran() {
  const { user } = useAuth();
  const { getOrdersForCustomer } = useData();
  const orders = getOrdersForCustomer(user.customerId);

  const ordersWithDelivery = orders.filter(
    (o) => o.status === "Selesai" || o.status === "Diantar" || o.bukti
  );

  const [selectedKode, setSelectedKode] = useState(ordersWithDelivery[0]?.id || "");
  const order = orders.find((o) => o.id === selectedKode);

  if (orders.length === 0) {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Data pesanan tidak ditemukan.</p>
      </div>
    );
  }

  const hasBukti = order?.bukti?.foto;

  return (
    <div className="w-full max-w-screen-xl mx-auto min-h-screen space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-inter-semibold text-slate-900">Bukti Pengantaran</h1>
        <p className="mt-2 text-sm text-slate-500">Lihat bukti pengantaran laundry ke alamat Anda.</p>

        <div className="mt-5">
          <label className="block text-sm font-inter-semibold text-gray-700 mb-2">Pilih Pesanan</label>
          <select
            value={selectedKode}
            onChange={(e) => setSelectedKode(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-200 bg-white"
          >
            {orders.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} — {item.layananLabel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {order && !hasBukti && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
          <IoImageOutline className="text-4xl text-amber-500 mx-auto mb-3" />
          <p className="font-inter-semibold text-amber-900">Pengantaran belum selesai</p>
          <p className="text-sm text-amber-700 mt-2">
            Bukti pengantaran belum tersedia. Kurir akan mengunggah foto setelah laundry diantar.
          </p>
          <StatusBadge status={order.status} className="mt-4" />
        </div>
      )}

      {order && hasBukti && (
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-inter-semibold text-lg">Detail Pengantaran</h2>
              <StatusBadge status="Selesai" />
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-200">
              <img
                src={order.bukti.foto}
                alt={`Bukti pengantaran ${order.id}`}
                className="w-full max-h-96 object-cover"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <IoCalendarOutline className="text-xl text-slate-600" />
                <div>
                  <p className="text-xs text-slate-500">Waktu Pengantaran</p>
                  <p className="font-semibold text-sm">{formatWaktu(order.bukti.waktu)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <IoPersonOutline className="text-xl text-slate-600" />
                <div>
                  <p className="text-xs text-slate-500">Kurir</p>
                  <p className="font-semibold text-sm">{order.bukti.kurirNama}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <IoMapOutline className="text-xl text-slate-600 mt-1" />
              <div>
                <p className="text-xs text-slate-500">Alamat Pengantaran</p>
                <p className="font-semibold text-sm">{order.alamat}</p>
              </div>
            </div>

            {order.bukti.catatan && (
              <p className="text-sm text-slate-600 italic">Catatan: {order.bukti.catatan}</p>
            )}
          </div>

          <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm h-fit">
            <p className="text-xs uppercase text-slate-500">Informasi Pesanan</p>
            <p className="mt-2 font-semibold">{order.id}</p>
            <p className="text-sm text-slate-600 mt-1">{order.layananLabel}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
              <IoTimeOutline />
              {formatWaktu(order.bukti.waktu)}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
