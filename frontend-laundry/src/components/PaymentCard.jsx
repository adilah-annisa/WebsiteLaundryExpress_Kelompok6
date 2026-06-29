import { Card, CardBody } from "./ui/Card";
import StatusBadge from "./StatusBadge";
import Button from "./ui/Button";
import { formatRupiah } from "../lib/constants";
import { IoQrCodeOutline } from "react-icons/io5";
import EmptyState from "./ui/EmptyState";
import { IoScaleOutline } from "react-icons/io5";

const ONGKIR = 5000;

export default function PaymentCard({ order, onPay, paymentCode }) {
  if (!order) return null;

  if (order.berat == null) {
    return (
      <EmptyState
        icon={IoScaleOutline}
        title="Menunggu Penimbangan"
        description="Berat laundry belum diinput oleh pemilik. Biaya akan ditampilkan setelah penimbangan selesai."
      />
    );
  }

  const subtotal = order.total || order.berat * order.tarifPerKg;
  const total = subtotal + ONGKIR;
  const code = paymentCode || `PAY-${order.id.replace("#", "")}`;

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-5 text-white">
        <p className="text-sm text-blue-100">Total Pembayaran</p>
        <p className="text-3xl font-bold mt-1 tracking-tight">{formatRupiah(total)}</p>
        <StatusBadge status={order.paymentStatus || "Belum Lunas"} className="mt-3" />
      </div>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Berat</p>
            <p className="font-semibold text-slate-900">{order.berat} Kg</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Harga/Kg</p>
            <p className="font-semibold text-slate-900">{formatRupiah(order.tarifPerKg)}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Subtotal</p>
            <p className="font-semibold text-slate-900">{formatRupiah(subtotal)}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Ongkir</p>
            <p className="font-semibold text-slate-900">{formatRupiah(ONGKIR)}</p>
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-slate-300 p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <IoQrCodeOutline className="text-3xl text-slate-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Kode Pembayaran</p>
            <p className="font-mono font-bold text-lg text-slate-900">{code}</p>
          </div>
        </div>
        {onPay && (
          <Button className="w-full" onClick={() => onPay(order)}>
            Bayar Sekarang
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
