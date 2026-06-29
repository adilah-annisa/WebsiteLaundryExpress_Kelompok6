import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";

export default function NotFound() {
  return (
    <Card className="max-w-md w-full text-center shadow-xl">
      <CardBody className="py-12">
        <p className="text-7xl font-black text-slate-200">404</p>
        <h1 className="text-xl font-bold text-slate-900 mt-4">Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-slate-500 mt-2">Route yang Anda akses tidak tersedia.</p>
        <Link to="/login" className="inline-block mt-8">
          <Button>Kembali ke Login</Button>
        </Link>
      </CardBody>
    </Card>
  );
}
