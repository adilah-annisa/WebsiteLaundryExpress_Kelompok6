import { useMemo, useState } from "react";
import UploadCard from "../../components/UploadCard";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Select";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { Alert } from "../../components/ui/Toast";
import { useToast } from "../../context/ToastContext";
import { useData } from "../../context/DataContext";
import { IoCloudUploadOutline } from "react-icons/io5";

export default function UploadBukti() {
  const { orders, uploadBukti } = useData();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ pesanan: "", foto: null, catatan: "" });
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const deliveryOrders = useMemo(
    () => orders.filter((o) => o.status === "Diantar" && !o.bukti?.foto),
    [orders]
  );

  const handleFileUpload = (_file, dataUrl) => {
    setError("");
    setFormData((prev) => ({ ...prev, foto: dataUrl }));
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

      showToast(
        `Bukti pengantaran berhasil disimpan. Waktu: ${new Date(result.waktu).toLocaleString("id-ID")}`,
        "success"
      );
      setFormData({ pesanan: "", foto: null, catatan: "" });
    } catch {
      setError("Upload gagal. Terjadi kesalahan. Silakan unggah ulang.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <Card>
        <CardHeader
          title="Upload Bukti Pengantaran"
          subtitle="Unggah foto bukti setelah laundry diantar ke pelanggan."
        />
        <CardBody>
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
              <Button variant="secondary" size="sm" className="mt-3" onClick={() => setError("")}>
                Upload Ulang
              </Button>
            </Alert>
          )}

          {deliveryOrders.length === 0 ? (
            <EmptyState
              icon={IoCloudUploadOutline}
              title="Tidak ada pesanan menunggu bukti"
              description="Pesanan dengan status Diantar akan muncul di sini."
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Select
                label="Pilih Pesanan"
                required
                value={formData.pesanan}
                onChange={(e) => setFormData((p) => ({ ...p, pesanan: e.target.value }))}
                options={[
                  { value: "", label: "Pilih Pesanan" },
                  ...deliveryOrders.map((o) => ({
                    value: o.id,
                    label: `${o.id} - ${o.nama} (${o.alamat})`,
                  })),
                ]}
              />

              <UploadCard onUpload={handleFileUpload} loading={uploading} error="" />

              <Textarea
                label="Catatan (Opsional)"
                name="catatan"
                value={formData.catatan}
                onChange={(e) => setFormData((p) => ({ ...p, catatan: e.target.value }))}
                rows={3}
              />

              <Button
                type="submit"
                className="w-full"
                loading={uploading}
                disabled={uploading || !formData.pesanan || !formData.foto}
              >
                {uploading ? "Menyimpan..." : "Simpan Bukti Pengantaran"}
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
