import { Card, CardBody } from "./ui/Card";
import Badge from "./ui/Badge";
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";

export default function ScheduleCard({ slot, selected, onSelect, disabled = false }) {
  const isFull = slot.terisi >= slot.kapasitas;
  const available = slot.kapasitas - slot.terisi;

  return (
    <Card
      hover={!disabled && !isFull}
      onClick={() => !disabled && !isFull && onSelect?.(slot)}
      className={`transition-all ${selected ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50/30" : ""} ${disabled || isFull ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <CardBody>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-bold text-slate-900 flex items-center gap-2">
              <IoCalendarOutline className="text-blue-600" />
              {slot.tanggal}
            </p>
            <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
              <IoTimeOutline /> {slot.jam}
            </p>
          </div>
          <Badge variant={isFull ? "danger" : "success"}>{isFull ? "Penuh" : "Tersedia"}</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-3 capitalize">{slot.jenis === "jemput" ? "Penjemputan" : "Pengantaran"}</p>
        {!isFull && <p className="text-xs text-emerald-600 font-semibold mt-1">{available} slot tersisa</p>}
      </CardBody>
    </Card>
  );
}
