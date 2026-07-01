import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useToast } from "../../context/ToastContext";
import { LAYANAN_OPTIONS, PENGANTARAN_OPTIONS } from "../../lib/constants";
import laundryServices from "../../data/LaundryServices.json";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Select";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Alert } from "../../components/ui/Toast";
import Badge from "../../components/ui/Badge";

export default function Pemesanan() {
  const { user } = useAuth();
  const { createOrder, getCustomerById, getAvailableSlots } = useData();
  const { showToast } = useToast();
  const customer = getCustomerById(user?.customerId);

  const [formData, setFormData] = useState({
    nama: customer?.name || "",
    nohp: customer?.phone || "",
    alamat: customer?.address || "",
    layanan: "",
    pengantaran: "jemput",
    slotId: "",
    catatan: "",
  });

  const [error, setError] = useState("");
  const [lastOrderId, setLastOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  const layananDetails = LAYANAN_OPTIONS.find((item) => item.value === formData.layanan);
  
  // Get available slots based on pengantaran type
  let availableSlots = [];
  if (formData.pengantaran === "jemput") {
    availableSlots = getAvailableSlots("jemput");
  } else if (formData.pengantaran === "antar") {
    availableSlots = getAvailableSlots("antar");
  } else if (formData.pengantaran === "antar-jemput") {
    // For antar-jemput, show both pickup and delivery slots
    const jemputSlots = getAvailableSlots("jemput");
    const antarSlots = getAvailableSlots("antar");
    availableSlots = [...jemputSlots, ...antarSlots];
  }

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
      slotId: "",
      catatan: "",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) return setError("Nama lengkap wajib diisi.");
    if (!formData.nohp.trim()) return setError("Nomor HP wajib diisi.");
    if (!formData.alamat.trim()) return setError("Alamat wajib diisi.");
    if (!formData.layanan) return setError("Jenis layanan wajib dipilih.");

    setLoading(true);
    try {
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
            <p className="text-sm text-slate-500">Isi data dan pilih jadwal antar-jemput</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Nama Lengkap *" name="nama" value={formData.nama} onChange={handleChange} />
                <Input label="Nomor HP *" name="nohp" type="tel" value={formData.nohp} onChange={handleChange} />
                <Select
                  label="Jenis Layanan *"
                  name="layanan"
                  value={formData.layanan}
                  onChange={handleChange}
                  options={[{ value: "", label: "Pilih layanan" }, ...LAYANAN_OPTIONS.map((l) => ({ value: l.value, label: `${l.label} — Rp ${l.price.toLocaleString("id-ID")}/Kg` }))]}
                />
                <Select
                  label="Jenis Antar-Jemput *"
                  name="pengantaran"
                  value={formData.pengantaran}
                  onChange={handleChange}
                  options={PENGANTARAN_OPTIONS}
                />
                <Select
                  label="Pilih Jadwal Antar-Jemput"
                  name="slotId"
                  value={formData.slotId}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Pilih jadwal (opsional)" },
                    ...availableSlots.map((slot) => ({
                      value: slot.id,
                      label: `${slot.tanggal} - ${slot.jam} (${slot.kapasitas - slot.terisi} slot tersedia)`,
                    })),
                  ]}
                />
              </div>
              <Textarea label="Alamat Lengkap *" name="alamat" rows={3} value={formData.alamat} onChange={handleChange} />
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

        <aside className="space-y-4">
          <Card>
            <CardHeader><h3 className="font-semibold text-slate-900">Pilihan Layanan</h3></CardHeader>
            <CardBody className="space-y-2">
              {laundryServices.map((s) => (
                <div key={s.value} className={`p-3 rounded-xl border text-sm cursor-pointer transition-all ${formData.layanan === s.value ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-300"}`} onClick={() => setFormData((p) => ({ ...p, layanan: s.value }))}>
                  <p className="font-semibold text-slate-800">{s.label}</p>
                  <p className="text-xs text-slate-500">Rp {s.price.toLocaleString("id-ID")}/Kg · {s.estimate}</p>
                </div>
              ))}
            </CardBody>
          </Card>
          {layananDetails && (
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0">
              <CardBody>
                <Badge variant="primary" className="bg-white/20 text-white border-white/30">Ringkasan</Badge>
                <p className="font-bold mt-3">{layananDetails.label}</p>
                <p className="text-sm text-blue-100 mt-1">Estimasi: {layananDetails.estimate}</p>
              </CardBody>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
