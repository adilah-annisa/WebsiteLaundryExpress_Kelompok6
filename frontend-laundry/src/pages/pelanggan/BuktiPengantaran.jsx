import { useState } from "react";
import {
  IoMapOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoImageOutline,
} from "react-icons/io5";
import pelangganData from "../../data/pelangganData.json";
import StatusBadge from "../../components/StatusBadge";

export default function BuktiPengantaran() {
  const [selectedKode, setSelectedKode] = useState(pelangganData.buktiList[0]?.kode || "");
  const [toast, setToast] = useState("");

  const bukti = pelangganData.buktiList.find((b) => b.kode === selectedKode);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  if (!bukti) {
    return (
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
            <IoImageOutline className="text-3xl text-gray-400" />
          </div>
          <p className="text-gray-600 font-poppins">Belum ada bukti pengantaran tersedia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl bg-slate-900 text-white px-5 py-3 text-sm font-inter-semibold shadow-lg">
          {toast}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <label className="block text-sm font-inter-semibold text-gray-700 mb-2">Pilih Pesanan</label>
        <select
          value={selectedKode}
          onChange={(e) => setSelectedKode(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-200 font-inter bg-white"
        >
          {pelangganData.buktiList.map((item) => (
            <option key={item.kode} value={item.kode}>
              {item.kode} — {item.tanggal}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="px-6 py-5 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
          <h2 className="font-inter-semibold text-xl text-gray-800">Bukti Pengantaran Laundry</h2>
          <p className="text-sm text-gray-500 mt-1">Pesanan {bukti.kode}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4 flex items-center gap-4">
            <IoCheckmarkCircleOutline className="text-3xl text-green-600 shrink-0" />
            <div>
              <h3 className="font-inter-semibold text-lg text-green-700">
                {bukti.status === "Selesai" ? "Pengantaran Selesai" : "Dalam Proses Pengantaran"}
              </h3>
              <p className="text-sm text-green-600">
                {bukti.status === "Selesai"
                  ? `Laundry diterima pada ${bukti.jam}`
                  : "Menunggu konfirmasi penerimaan pelanggan"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-inter-semibold text-gray-800 mb-3">Foto Bukti Pengantaran</h3>
            <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 h-64 flex items-center justify-center">
              {bukti.foto ? (
                <img src={bukti.foto} alt="Bukti Pengantaran" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center px-6">
                  <IoImageOutline className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-poppins text-sm">Foto bukti akan tampil setelah kurir mengunggah</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <IoCalendarOutline className="text-xl text-[#3b6fd8]" />
                <p className="text-xs font-inter-semibold text-gray-600 uppercase">Tanggal</p>
              </div>
              <p className="font-inter-semibold text-gray-800">{bukti.tanggal}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <IoTimeOutline className="text-xl text-[#3b6fd8]" />
                <p className="text-xs font-inter-semibold text-gray-600 uppercase">Waktu</p>
              </div>
              <p className="font-inter-semibold text-gray-800">{bukti.jam}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all md:col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <IoMapOutline className="text-xl text-[#3b6fd8]" />
                <p className="text-xs font-inter-semibold text-gray-600 uppercase">Alamat Pengantaran</p>
              </div>
              <p className="font-inter-semibold text-gray-800">{bukti.alamat}</p>
            </div>
          </div>

          <div>
            <h3 className="font-inter-semibold text-gray-800 mb-3">Informasi Kurir</h3>
            <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <IoPersonOutline className="text-2xl text-[#3b6fd8]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-poppins mb-1">Dikerjakan oleh</p>
                  <p className="font-inter-semibold text-gray-800">{bukti.kurirNama}</p>
                  <p className="text-sm text-gray-600 font-poppins">{bukti.kurirNo}</p>
                </div>
              </div>
            </div>
          </div>

          {bukti.catatan && (
            <div>
              <h3 className="font-inter-semibold text-gray-800 mb-3">Catatan Pengantaran</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-gray-700 font-poppins">{bukti.catatan}</p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-gray-600 font-inter-medium">Status Pesanan:</span>
            <StatusBadge status={bukti.status} />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => showToast("Bukti pengantaran berhasil diunduh (simulasi).")}
              className="w-full sm:flex-1 bg-linear-to-r from-[#3b6fd8] to-[#1565C0] text-white px-6 py-3 rounded-lg font-inter-semibold hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              Unduh Bukti
            </button>
            <button
              type="button"
              onClick={() => showToast("Link bukti disalin ke clipboard (simulasi).")}
              className="w-full sm:flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-inter-medium hover:bg-gray-50 transition-colors"
            >
              Bagikan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
