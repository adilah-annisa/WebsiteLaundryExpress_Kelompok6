import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useToast } from "../../context/ToastContext";
import { PENGANTARAN_OPTIONS, PAYMENT_METHOD_OPTIONS } from "../../lib/constants";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Select";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Alert } from "../../components/ui/Toast";
// Badge and layanan list removed per requirements

export default function Pemesanan() {
  const { user } = useAuth();
  const { createOrder, getCustomerById } = useData();
  const { showToast } = useToast();
  const customer = getCustomerById(user?.customerId);

  const [formData, setFormData] = useState({
    nama: customer?.name || "",
    nohp: customer?.phone || "",
    alamat: customer?.address || "",
    layanan: "",
    pengantaran: "jemput",
    paymentMethod: "Tunai",
    catatan: "",
  });

  const [error, setError] = useState("");
  const [lastOrderId, setLastOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleReset = () => {
    setFormData({
      nama: customer?.name || "",
      nohp: customer?.phone || "",
      alamat: customer?.address || "",
      layanan: "",
      pengantaran: "jemput",
      paymentMethod: "Tunai",
      catatan: "",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) return setError("Nama lengkap wajib diisi.");
    if (!formData.nohp.trim()) return setError("Nomor HP wajib diisi.");
    if (!formData.alamat.trim()) return setError("Alamat wajib diisi.");
    // layanan selection removed; default will be applied server-side if needed

    setLoading(true);
    try {
      const order = createOrder({
        customerId: user.customerId,
        nama: formData.nama.trim(),
        nohp: formData.nohp.trim(),
        alamat: formData.alamat.trim(),
        layanan: formData.layanan,
        pengantaran: formData.pengantaran,
        paymentMethod: formData.paymentMethod,
        catatan: formData.catatan.trim(),
      });
      setLastOrderId(order.id);
      showToast(`Pesanan ${order.id} berhasil dibuat!`, "success");
      handleReset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      {lastOrderId && (
        <Alert variant="success">
          Pesanan <strong>{lastOrderId}</strong> tersimpan.{" "}
          <Link to="/pelanggan/riwayat" className="underline font-semibold">Lihat riwayat laundry →</Link>
        </Alert>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-slate-900">Form Pemesanan Laundry</h2>
            <p className="text-sm text-slate-500">Isi data untuk pesanan antar-jemput; jadwal akan ditentukan kemudian.</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Nama Lengkap *" name="nama" value={formData.nama} onChange={handleChange} />
                <Input label="Nomor HP *" name="nohp" type="tel" value={formData.nohp} onChange={handleChange} />
                {/* Layanan selection removed per requirements */}
                <Select
                  label="Jenis Antar-Jemput *"
                  name="pengantaran"
                  value={formData.pengantaran}
                  onChange={handleChange}
                  options={PENGANTARAN_OPTIONS}
                />
              </div>
              <Textarea label="Alamat Lengkap *" name="alamat" rows={3} value={formData.alamat} onChange={handleChange} />
              <Select
                label="Metode Pembayaran *"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                options={PAYMENT_METHOD_OPTIONS}
              />
              <Textarea label="Catatan (Opsional)" name="catatan" rows={2} value={formData.catatan} onChange={handleChange} />

              <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-800">
                Biaya final dihitung setelah penimbangan oleh pemilik laundry.
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" loading={loading} className="flex-1">Simpan Pesanan</Button>
                <Button type="button" variant="secondary" onClick={handleReset}>Reset</Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Pilihan layanan and ringkasan removed per requirements */}
      </div>
    </div>
  );
}
