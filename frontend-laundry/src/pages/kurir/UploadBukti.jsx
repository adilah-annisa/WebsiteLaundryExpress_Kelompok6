import { useMemo, useState } from "react";
import { IoCloudUploadOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { useData } from "../../context/DataContext";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function UploadBukti() {
  const { orders, uploadBukti } = useData();
  const [formData, setFormData] = useState({ pesanan: "", foto: null, catatan: "" });
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const deliveryOrders = useMemo(
    () => orders.filter((o) => o.status === "Diantar" && !o.bukti?.foto),
    [orders]
  );

  const handleFileChange = (e) => {
    setError("");
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Upload gagal. File harus berupa gambar (JPG/PNG).");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Upload gagal. Ukuran file maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setError("Upload gagal. Gagal membaca file. Silakan unggah ulang.");
    };
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, foto: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.pesanan) {
      setError("Pilih pesanan terlebih dahulu.");
      return;
    }
    if (!formData.foto) {
      setError("Upload gagal. Foto bukti wajib diunggah.");
      return;
    }

    setUploading(true);
    try {
      const result = uploadBukti(formData.pesanan, {
        foto: formData.foto,
        catatan: formData.catatan,
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setToast(`Bukti pengantaran berhasil disimpan. Waktu: ${new Date(result.waktu).toLocaleString("id-ID")}`);
      setFormData({ pesanan: "", foto: null, catatan: "" });
      setPreview(null);
      setTimeout(() => setToast(""), 5000);
    } catch {
      setError("Upload gagal. Terjadi kesalahan. Silakan unggah ulang.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl bg-green-600 text-white px-5 py-3 text-sm font-semibold shadow-lg flex items-center gap-2">
          <IoCheckmarkCircleOutline className="text-xl" />
          {toast}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b bg-gradient-to-r from-gray-50 to-white">
          <h2 className="font-semibold text-xl">Upload Bukti Pengantaran</h2>
          <p className="text-sm text-gray-500 mt-1">Unggah foto bukti setelah laundry diantar ke pelanggan.</p>
        </div>

        {error && (
          <div className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Pesanan <span className="text-red-500">*</span></label>
            {deliveryOrders.length === 0 ? (
              <p className="text-sm text-gray-500">Tidak ada pesanan dengan status Diantar yang menunggu bukti.</p>
            ) : (
              <select
                name="pesanan"
                value={formData.pesanan}
                onChange={(e) => setFormData((p) => ({ ...p, pesanan: e.target.value }))}
                className="w-full border rounded-lg px-4 py-3 cursor-pointer"
                required
              >
                <option value="">Pilih Pesanan</option>
                {deliveryOrders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} - {o.nama} ({o.alamat})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Foto Bukti <span className="text-red-500">*</span></label>
            {!preview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-400 transition-colors">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-input" />
                <label htmlFor="file-input" className="flex flex-col items-center cursor-pointer">
                  <IoCloudUploadOutline className="text-4xl text-gray-400 mb-3" />
                  <p className="font-semibold text-gray-700">Klik untuk memilih foto</p>
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG — Maks 5MB</p>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <img src={preview} alt="Preview" className="w-full max-h-64 object-cover rounded-xl border" />
                <button type="button" onClick={() => { setPreview(null); setFormData((p) => ({ ...p, foto: null })); }} className="w-full py-2 border rounded-lg text-sm">
                  Ubah Foto
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan (Opsional)</label>
            <textarea
              name="catatan"
              value={formData.catatan}
              onChange={(e) => setFormData((p) => ({ ...p, catatan: e.target.value }))}
              rows="3"
              className="w-full border rounded-lg px-4 py-3 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={uploading || deliveryOrders.length === 0 || !formData.pesanan || !formData.foto}
            className="w-full bg-gradient-to-r from-[#3b6fd8] to-[#1565C0] text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {uploading ? "Menyimpan..." : "Simpan Bukti Pengantaran"}
          </button>
        </form>
      </div>
    </div>
  );
}
