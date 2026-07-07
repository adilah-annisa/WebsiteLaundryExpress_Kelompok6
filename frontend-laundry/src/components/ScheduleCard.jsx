import { Card, CardBody } from "./ui/Card";
import Badge from "./ui/Badge";
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";

export default function ScheduleCard({ slot, selected, onSelect, disabled = false }) {
  // Single-courier system: slot is taken if terisi >= 1
  const isTaken = !!slot.terisi;

  return (
    <Card
      hover={!disabled && !isTaken}
      onClick={() => !disabled && !isTaken && onSelect?.(slot)}
      className={`transition-all ${selected ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50/30" : ""} ${disabled || isTaken ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <CardBody>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-bold text-slate-900 flex items-center gap-2">
              <IoTimeOutline className="text-blue-600" />
              {slot.jam}
            </p>
          </div>
          <Badge variant={isTaken ? "danger" : "success"}>{isTaken ? "Terisi" : "Tersedia"}</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-3 capitalize">{slot.jenis === "jemput" ? "Penjemputan" : "Pengantaran"}</p>
      </CardBody>
    </Card>
  );
}
