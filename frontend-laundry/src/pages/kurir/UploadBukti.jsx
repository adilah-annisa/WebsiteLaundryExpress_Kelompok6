import { useState } from "react";
import { IoCloudUploadOutline, IoCheckmarkCircleOutline, IoImage } from "react-icons/io5";

export default function UploadBukti() {
  const [formData, setFormData] = useState({
    pesanan: "",
    foto: null,
    catatan: "",
  });

  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const pesananOptions = [
    { value: "K001", label: "#K001 - Ahmad Rizky (Jl. Melati No. 12)" },
    { value: "K002", label: "#K002 - Siti Aminah (Jl. Mawar No. 5)" },
    { value: "K003", label: "#K003 - Budi Santoso (Perumahan Griya Indah Blok C)" },
    { value: "K004", label: "#K004 - Rani Putri (Jl. Kenanga No. 27)" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        foto: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.pesanan && formData.foto) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setFormData({ pesanan: "", foto: null, catatan: "" });
      setPreview(null);
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      foto: null,
    }));
    setPreview(null);
  };

  return (
    <div className="max-w-2xl">
      {/* Success Message */}
      {submitted && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in">
          <IoCheckmarkCircleOutline className="text-2xl text-green-600 flex-shrink-0" />
          <div>
            <p className="font-inter-semibold text-green-700">Bukti Pengantaran Berhasil Diunggah!</p>
            <p className="text-sm text-green-600">Terima kasih telah menyelesaikan pengantaran.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="font-inter-semibold text-xl text-gray-800">
            Upload Bukti Pengantaran
          </h2>
          <p className="text-sm text-gray-500 mt-1">Unggah foto bukti pengantaran untuk menyelesaikan tugas</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Pilih Pesanan */}
          <div>
            <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
              Pilih Pesanan <span className="text-red-500">*</span>
            </label>
            <select
              name="pesanan"
              value={formData.pesanan}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b6fd8] focus:border-transparent transition-all hover:border-gray-400 cursor-pointer"
              required
            >
              <option value="">Pilih Pesanan</option>
              {pesananOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Foto */}
          <div>
            <label className="block text-sm font-inter-semibold text-gray-700 mb-3">
              Foto Bukti Pengantaran <span className="text-red-500">*</span>
            </label>

            {!preview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#3b6fd8] hover:bg-blue-50 transition-all cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                  required
                />
                <label
                  htmlFor="file-input"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <IoCloudUploadOutline className="text-4xl text-gray-400 mb-3 group-hover:text-[#3b6fd8] transition-colors" />
                  <p className="font-inter-semibold text-gray-700 text-center">
                    Seret foto ke sini atau klik untuk memilih
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Format: JPG, PNG (Maks 5MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border-2 border-green-200 bg-green-50">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-inter-semibold">
                    <IoCheckmarkCircleOutline className="text-sm" />
                    Dipilih
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 font-inter-medium hover:bg-gray-50 transition-colors"
                >
                  Ubah Foto
                </button>
              </div>
            )}
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-sm font-inter-semibold text-gray-700 mb-2">
              Catatan Pengantaran (Opsional)
            </label>
            <textarea
              name="catatan"
              value={formData.catatan}
              onChange={handleChange}
              placeholder="Contoh: Pelanggan tidak ada di rumah, paket ditinggalkan di depan pintu. Hubungi pelanggan untuk konfirmasi."
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b6fd8] focus:border-transparent transition-all hover:border-gray-400 resize-none"
            />
          </div>

          {/* Checklist */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm font-inter-semibold text-blue-900 mb-3">Sebelum mengunggah, pastikan:</p>
            <ul className="text-sm text-blue-800 space-y-2 font-poppins">
              <li>✓ Foto menunjukkan paket laundry dengan jelas</li>
              <li>✓ Foto mencakup bukti penerimaan (resi/tanda tangan)</li>
              <li>✓ Kondisi cahaya cukup dan foto tidak blur</li>
              <li>✓ Alamat pengantaran sesuai dengan pesanan</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={!formData.pesanan || !formData.foto}
              className="flex-1 bg-gradient-to-r from-[#3b6fd8] to-[#1565C0] text-white px-6 py-3 rounded-lg font-inter-semibold hover:shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simpan Bukti Pengantaran
            </button>
            <button
              type="reset"
              onClick={() => {
                setFormData({ pesanan: "", foto: null, catatan: "" });
                setPreview(null);
              }}
              className="px-6 py-3 rounded-lg font-inter-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Bersihkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}