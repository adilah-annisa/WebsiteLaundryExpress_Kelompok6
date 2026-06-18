import { useState } from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

export default function Pemesanan() {
  const [formData, setFormData] = useState({
    nama: "",
    nohp: "",
    alamat: "",
    layanan: "",
    pengantaran: "antar",
    berat: "",
    tanggal: "",
    jam: "",
    catatan: "",
  });

  const [toast, setToast] = useState("");

  const layananOptions = [
    { value: "cuci-kering", label: "Cuci Kering (Rp 3.000/Kg)", price: 3000 },
    { value: "cuci-setrika", label: "Cuci Setrika (Rp 7.000/Kg)", price: 7000 },
    { value: "setrika-saja", label: "Setrika Saja (Rp 4.000/Kg)", price: 4000 },
    { value: "dry-clean", label: "Dry Clean (Rp 15.000/Kg)", price: 15000 },
  ];

  const biayaLayanan = layananOptions.find((item) => item.value === formData.layanan)?.price || 0;
  const beratAngka = Number(formData.berat) || 0;
  const totalBiaya = biayaLayanan * beratAngka;

  const formattedTotal = totalBiaya
    ? `Rp ${totalBiaya.toLocaleString("id-ID")}`
    : "-";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nama && formData.nohp && formData.alamat && formData.layanan && formData.tanggal && formData.jam) {
      setToast("Pesanan berhasil dibuat! Kurir akan segera menjemput laundry Anda.");
      setTimeout(() => setToast(""), 5000);
      setFormData({
        nama: "",
        nohp: "",
        alamat: "",
        layanan: "",
        pengantaran: "antar",
        berat: "",
        tanggal: "",
        jam: "",
        catatan: "",
      });
    }
  };

  return (
    <div className="max-w-3xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl bg-green-600 text-white px-5 py-3 text-sm font-inter-semibold shadow-lg flex items-center gap-2">
          <IoCheckmarkCircleOutline className="text-xl" />
          {toast}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="px-6 py-5 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
          <h2 className="font-inter-semibold text-xl text-gray-800">
            Form Pemesanan Laundry
          </h2>
          <p className="text-sm text-gray-500 mt-1">Isi informasi di bawah untuk membuat pesanan laundry baru</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama Anda"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b6fd8] focus:border-transparent transition-all hover:border-gray-400"
                required
              />
            </div>

            {/* No HP */}
            <div>
              <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
                Nomor HP <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="nohp"
                value={formData.nohp}
                onChange={handleChange}
                placeholder="081234567890"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b6fd8] focus:border-transparent transition-all hover:border-gray-400"
                required
              />
            </div>

            {/* Jenis Layanan */}
            <div>
              <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
                Jenis Layanan <span className="text-red-500">*</span>
              </label>
              <select
                name="layanan"
                value={formData.layanan}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b6fd8] focus:border-transparent transition-all hover:border-gray-400 cursor-pointer"
                required
              >
                <option value="">Pilih Layanan</option>
                {layananOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Berat Laundry */}
            <div>
              <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
                Berat (Kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                name="berat"
                value={formData.berat}
                onChange={handleChange}
                placeholder="Contoh: 3.5"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b6fd8] focus:border-transparent transition-all hover:border-gray-400"
                required
              />
            </div>

            {/* Jenis Pengantaran */}
            <div>
              <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
                Pilih Layanan Antar/Jemput <span className="text-red-500">*</span>
              </label>
              <select
                name="pengantaran"
                value={formData.pengantaran}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sidebar-end focus:border-transparent transition-all hover:border-gray-400 cursor-pointer"
              >
                <option value="antar">Antar ke Laundry</option>
                <option value="jemput">Jemput ke Rumah</option>
              </select>
            </div>

            {/* Tanggal Jemput */}
            <div>
              <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
                Tanggal Jemput <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b6fd8] focus:border-transparent transition-all hover:border-gray-400"
                required
              />
            </div>

            {/* Jam Jemput */}
            <div>
              <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
                Jam Jemput <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="jam"
                value={formData.jam}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b6fd8] focus:border-transparent transition-all hover:border-gray-400"
                required
              />
            </div>

            {/* Alamat Jemput */}
            <div className="md:col-span-2">
              <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
                Alamat Jemput <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap jemput laundry"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b6fd8] focus:border-transparent transition-all hover:border-gray-400"
                required
              />
            </div>

            <div className="md:col-span-2 rounded-3xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-sm font-inter-semibold text-blue-900">Ringkasan Biaya</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white p-4 border border-slate-200">
                  <p className="text-sm text-slate-500">Harga per Kg</p>
                  <p className="mt-2 text-xl font-inter-semibold text-slate-900">
                    {biayaLayanan ? `Rp ${biayaLayanan.toLocaleString("id-ID")}` : "-"}
                  </p>
                </div>
                <div className="rounded-3xl bg-white p-4 border border-slate-200">
                  <p className="text-sm text-slate-500">Total Berat</p>
                  <p className="mt-2 text-xl font-inter-semibold text-slate-900">
                    {beratAngka ? `${beratAngka.toFixed(1)} Kg` : "-"}
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-3xl bg-slate-800 p-4 text-white">
                <p className="text-sm text-slate-300">Estimasi Total</p>
                <p className="mt-2 text-3xl font-inter-semibold">{formattedTotal}</p>
              </div>
            </div>

            {/* Catatan Tambahan */}
            <div className="md:col-span-2">
              <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                placeholder="Contoh: Bahan sensitif, permintaan khusus, dll"
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sidebar-end focus:border-transparent transition-all hover:border-gray-400"
              />
            </div>
          </div>

          {/* Tombol Submit */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
                className="w-full sm:flex-1 bg-linear-to-r from-sidebar-end to-[#1565C0] text-white px-6 py-3 rounded-lg font-inter-semibold hover:shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98] duration-200"
            >
              Pesan Laundry
            </button>
            <button
              type="reset"
              className="w-full sm:w-auto px-6 py-3 rounded-lg font-inter-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Bersihkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}