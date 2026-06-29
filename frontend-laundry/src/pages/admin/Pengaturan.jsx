import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import { IoStorefrontOutline, IoNotificationsOutline } from "react-icons/io5";

export default function Pengaturan() {
  const { showToast } = useToast();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <IoStorefrontOutline className="text-blue-600" /> Informasi Laundry
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input label="Nama Usaha" defaultValue="Laundry Express" />
          <Input label="Alamat Outlet" defaultValue="Jl. Melati No. 1, Jakarta" />
          <Input label="Jam Operasional" defaultValue="08:00 - 20:00 WIB" />
          <Button onClick={() => showToast("Pengaturan berhasil disimpan.", "success")}>Simpan Pengaturan</Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <IoNotificationsOutline className="text-blue-600" /> Notifikasi
          </h2>
        </CardHeader>
        <CardBody className="space-y-3 text-sm text-slate-600">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-slate-300" />
            Email notifikasi pesanan baru
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-slate-300" />
            Reminder jadwal kurir
          </label>
        </CardBody>
      </Card>
    </div>
  );
}
