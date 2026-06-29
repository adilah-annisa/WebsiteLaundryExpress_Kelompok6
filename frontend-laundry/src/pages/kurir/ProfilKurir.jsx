import { useAuth } from "../../context/AuthContext";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { KURIR_NAMA } from "../../lib/constants";
import { IoPersonOutline, IoMailOutline, IoCarOutline } from "react-icons/io5";

export default function ProfilKurir() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-slate-900">Profil Kurir</h2>
          <p className="text-sm text-slate-500">Data kurir pengantaran</p>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input label="Nama Kurir" value={KURIR_NAMA} readOnly icon={IoPersonOutline} />
          <Input label="Email" value={user?.email || "kurir@laundryexpress.id"} readOnly icon={IoMailOutline} />
          <Input label="Username" value={user?.username || ""} readOnly icon={IoCarOutline} />
          <Input label="Peran" value="Kurir (Single Courier)" readOnly />
        </CardBody>
      </Card>
    </div>
  );
}
