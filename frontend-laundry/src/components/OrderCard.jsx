import StatusBadge from "./StatusBadge";
import { Card, CardBody } from "./ui/Card";
import { IoCalendarOutline, IoPersonOutline } from "react-icons/io5";

export default function OrderCard({ order, onClick, selected = false }) {
  return (
    <Card
      hover
      onClick={onClick}
      className={`cursor-pointer transition-all ${selected ? "ring-2 ring-blue-500 border-blue-300" : ""}`}
    >
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-bold text-slate-900">{order.id || order.kode}</p>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
              <IoPersonOutline /> {order.nama || order.name}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-sm font-medium text-slate-700">{order.layananLabel || order.layanan}</p>
        {(order.tanggal || order.date) && (
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <IoCalendarOutline /> {order.tanggal || order.date} {order.jam || order.time || ""}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
