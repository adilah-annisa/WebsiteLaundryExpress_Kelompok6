import { useState } from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import PageHeader from "../../DashboardAdmin/components/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { LAYANAN_OPTIONS } from "../../lib/constants";

export default function Pemesanan() {
  const { user } = useAuth();
  const { createOrder, getCustomerById } = useData();
  const customer = getCustomerById(user?.customerId);

  const [formData, setFormData] = useState({
    nama: customer?.name || "",
    nohp: customer?.phone || "",
    alamat: customer?.address || "",
    layanan: "",
    pengantaran: "jemput",
    catatan: "",
  });

  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [lastOrderId, setLastOrderId] = useState(null);

  const layananDetails = LAYANAN_OPTIONS.find((item) => item.value === formData.layanan);
  const selectedDelivery = formData.pengantaran === "jemput" ? "Jemput ke Rumah" : "Antar ke Laundry";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nama.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }
    if (!formData.nohp.trim()) {
      setError("Nomor HP wajib diisi.");
      return;
    }
    if (!formData.alamat.trim()) {
      setError("Alamat wajib diisi.");
      return;
    }
    if (!formData.layanan) {
      setError("Jenis layanan wajib dipilih.");
      return;
    }

    const order = createOrder({
      customerId: user.customerId,
      nama: formData.nama.trim(),
      nohp: formData.nohp.trim(),
      alamat: formData.alamat.trim(),
      layanan: formData.layanan,
      pengantaran: formData.pengantaran,
      catatan: formData.catatan.trim(),
    });

    setLastOrderId(order.id);
    setToast(`Pesanan ${order.id} berhasil dibuat! Silakan pilih jadwal antar-jemput.`);
    setFormData({
      nama: customer?.name || "",
      nohp: customer?.phone || "",
      alamat: customer?.address || "",
      layanan: "",
      pengantaran: "jemput",
      catatan: "",
    });
    setTimeout(() => setToast(""), 6000);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto min-h-screen space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl bg-green-600 text-white px-5 py-3 text-sm font-inter-semibold shadow-lg flex items-center gap-2 max-w-sm">
          <IoCheckmarkCircleOutline className="text-xl shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <PageHeader
        title="Pemesanan Laundry"
        subtitle="Buat pesanan laundry. Berat akan ditimbang oleh pemilik setelah cucian diterima."
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {lastOrderId && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Pesanan <strong>{lastOrderId}</strong> tersimpan.{" "}
          <Link to="/pelanggan/jadwal" className="font-semibold underline">
            Pilih jadwal antar-jemput →
          </Link>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1.3fr_minmax(240px,320px)] items-start">
        <section className="space-y-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b6fd8]"
                />
              </div>
              <div>
                <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
                  Nomor HP <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="nohp"
                  value={formData.nohp}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b6fd8]"
                />
              </div>
              <div>
                <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
                  Jenis Layanan <span className="text-red-500">*</span>
                </label>
                <select
                  name="layanan"
                  value={formData.layanan}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b6fd8] cursor-pointer"
                >
                  <option value="">Pilih Layanan</option>
                  {LAYANAN_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} (Rp {option.price.toLocaleString("id-ID")}/Kg)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
                  Metode <span className="text-red-500">*</span>
                </label>
                <select
                  name="pengantaran"
                  value={formData.pengantaran}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b6fd8] cursor-pointer"
                >
                  <option value="jemput">Jemput ke Rumah</option>
                  <option value="antar">Antar ke Laundry</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b6fd8] resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-inter-semibold text-gray-700 mb-2">Catatan (Opsional)</label>
                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b6fd8] resize-none"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
              Biaya final dihitung setelah pemilik menimbang cucian. Status biaya: <strong>Menunggu Penimbangan</strong>.
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#3b6fd8] to-[#1565C0] text-white px-6 py-3 rounded-2xl font-inter-semibold hover:shadow-lg transition-all"
            >
              Kirim Pesanan
            </button>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Ringkasan</p>
            <div className="mt-4 space-y-3 text-sm">
              <p><span className="text-slate-500">Layanan:</span> {layananDetails?.label || "-"}</p>
              <p><span className="text-slate-500">Metode:</span> {selectedDelivery}</p>
              <p><span className="text-slate-500">Tarif:</span> {layananDetails ? `Rp ${layananDetails.price.toLocaleString("id-ID")}/Kg` : "-"}</p>
              <p><span className="text-slate-500">Estimasi:</span> {layananDetails?.estimate || "-"}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
