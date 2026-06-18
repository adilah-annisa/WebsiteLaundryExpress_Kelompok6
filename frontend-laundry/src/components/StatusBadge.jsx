const statusStyles = {
  // Laundry flow (umum di proyek ini)
  "Pesanan Dibuat": "bg-gray-100 text-gray-700 border border-gray-200",
  "Dijemput Kurir": "bg-indigo-100 text-indigo-700 border border-indigo-200",
  "Sedang Dicuci": "bg-yellow-100 text-yellow-700 border border-yellow-200",
  "Sedang Disetrika": "bg-blue-100 text-blue-700 border border-blue-200",
  "Siap Diantar": "bg-green-100 text-green-700 border border-green-200",
  "Selesai": "bg-green-100 text-green-700 border border-green-200",

  // Status yang muncul di data/halaman admin & kurir saat ini
  Diproses: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Diantar: "bg-blue-100 text-blue-700 border border-blue-200",
  Selesai: "bg-green-100 text-green-700 border border-green-200",
  Dijemput: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  Cancel: "bg-red-100 text-red-700 border border-red-200",
  Total: "bg-gray-100 text-gray-700 border border-gray-200",

  // Keuangan
  Lunas: "bg-green-100 text-green-700 border border-green-200",
  "Belum Lunas": "bg-red-100 text-red-700 border border-red-200",

  "Menunggu Penimbangan": "bg-orange-100 text-orange-700 border border-orange-200",
};

export default function StatusBadge({ status, className = "" }) {
  const style = statusStyles[status] || "bg-gray-100 text-gray-600 border border-gray-100";

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-inter-semibold ${style} ${className}`}
    >
      <span className="sr-only">Status:</span>
      {status}
    </span>
  );
}


