import { IoMapOutline, IoPersonOutline, IoCalendarOutline, IoTimeOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import StatusBadge from "../../DashboardAdmin/components/StatusBadge";

export default function BuktiPengantaran() {
  // Sample data - in real app this would come from props or API
  const bukti = {
    kode: "#P001",
    status: "Selesai",
    tanggal: "15 Januari 2025",
    jam: "14:30 WIB",
    kurirNama: "Ahmad Rizky",
    kurirNo: "081234567890",
    alamat: "Jl. Melati No. 12, Jakarta Selatan",
    foto: "/delivery-proof.jpg",
    catatan: "Laundry telah dikirimkan dengan aman ke alamat tujuan",
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="font-inter-semibold text-xl text-gray-800">
            Bukti Pengantaran Laundry
          </h2>
          <p className="text-sm text-gray-500 mt-1">Pesanan {bukti.kode}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4 flex items-center gap-4">
            <IoCheckmarkCircleOutline className="text-3xl text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-inter-semibold text-lg text-green-700">Pengantaran Selesai</h3>
              <p className="text-sm text-green-600">Laundry Anda telah diterima pada {bukti.jam}</p>
            </div>
          </div>

          {/* Foto Bukti */}
          <div>
            <h3 className="font-inter-semibold text-gray-800 mb-3">Foto Bukti Pengantaran</h3>
            <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 h-64 flex items-center justify-center">
              {bukti.foto ? (
                <img src={bukti.foto} alt="Bukti Pengantaran" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <p className="text-gray-500 font-poppins">Foto bukti pengantaran tidak tersedia</p>
                </div>
              )}
            </div>
          </div>

          {/* Detail Informasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tanggal & Jam */}
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

            {/* Alamat Pengantaran */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all md:col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <IoMapOutline className="text-xl text-[#3b6fd8]" />
                <p className="text-xs font-inter-semibold text-gray-600 uppercase">Alamat Pengantaran</p>
              </div>
              <p className="font-inter-semibold text-gray-800">{bukti.alamat}</p>
            </div>
          </div>

          {/* Info Kurir */}
          <div>
            <h3 className="font-inter-semibold text-gray-800 mb-3">Informasi Kurir</h3>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
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

          {/* Catatan */}
          {bukti.catatan && (
            <div>
              <h3 className="font-inter-semibold text-gray-800 mb-3">Catatan Pengantaran</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-gray-700 font-poppins">{bukti.catatan}</p>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-inter-medium">Status Pesanan:</span>
              <StatusBadge status={bukti.status} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button className="w-full sm:flex-1 bg-gradient-to-r from-[#3b6fd8] to-[#1565C0] text-white px-6 py-3 rounded-lg font-inter-semibold hover:shadow-lg transition-all">
              Unduh Bukti
            </button>
            <button className="w-full sm:flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-inter-medium hover:bg-gray-50 transition-colors">
              Bagikan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
