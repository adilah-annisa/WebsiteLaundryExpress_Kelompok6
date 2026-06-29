import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { IoPersonOutline, IoMailOutline, IoCallOutline, IoLocationOutline } from "react-icons/io5";

export default function ProfilPelanggan() {
  const { user } = useAuth();
  const { getCustomerById } = useData();
  const customer = getCustomerById(user?.customerId);

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-slate-900">Profil Pelanggan</h2>
          <p className="text-sm text-slate-500">Informasi akun dan kontak</p>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input label="Nama" value={customer?.name || user?.name || ""} readOnly icon={IoPersonOutline} />
          <Input label="Email" value={customer?.email || user?.email || ""} readOnly icon={IoMailOutline} />
          <Input label="Telepon" value={customer?.phone || ""} readOnly icon={IoCallOutline} />
          <Input label="Alamat" value={customer?.address || ""} readOnly icon={IoLocationOutline} />
          <Input label="Username" value={user?.username || ""} readOnly />
        </CardBody>
      </Card>
    </div>
  );
}
