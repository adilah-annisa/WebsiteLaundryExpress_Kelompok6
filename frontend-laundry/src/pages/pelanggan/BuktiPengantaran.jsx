import { useMemo, useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import Timeline from "../../components/Timeline";
import Select from "../../components/ui/Select";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

function formatWaktu(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
}

function buildTimeline(order) {
  const steps = [
    { id: "order", title: "Pesanan dibuat", time: formatWaktu(order.createdAt), done: true },
    {
      id: "schedule",
      title: "Jadwal dipilih",
      time: order.tanggal ? `${order.tanggal} pukul ${order.jam}` : "Belum dipilih",
      done: Boolean(order.slotId),
    },
    { id: "process", title: "Laundry diproses", done: !["Diproses"].includes(order.status) },
    { id: "delivery", title: "Laundry diantar", done: ["Diantar", "Selesai"].includes(order.status) },
  ];

  if (order.bukti?.foto) {
    steps.push({
      id: "proof",
      title: "Bukti pengantaran",
      time: formatWaktu(order.bukti.waktu),
      description: order.bukti.catatan || `Diantar oleh ${order.bukti.kurirNama || "Kurir"}`,
      image: order.bukti.foto,
      done: true,
    });
  } else {
    steps.push({ id: "proof", title: "Menunggu bukti pengantaran", done: false });
  }

  return steps;
}

export default function BuktiPengantaran() {
  const { user } = useAuth();
  const { getOrdersForCustomer } = useData();
  const orders = getOrdersForCustomer(user.customerId);

  const [selectedKode, setSelectedKode] = useState(orders[0]?.id || "");
  const order = orders.find((o) => o.id === selectedKode);
  const hasBukti = order?.bukti?.foto;

  const timelineItems = useMemo(() => (order ? buildTimeline(order) : []), [order]);

  if (orders.length === 0) {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-4 py-12">
        <EmptyState title="Data pesanan tidak ditemukan" description="Buat pesanan terlebih dahulu." />
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card>
        <CardHeader title="Bukti Pengantaran" subtitle="Lihat timeline dan bukti pengantaran laundry." />
        <CardBody>
          <Select
            label="Pilih Pesanan"
            value={selectedKode}
            onChange={(e) => setSelectedKode(e.target.value)}
            options={orders.map((item) => ({
              value: item.id,
              label: `${item.id} — ${item.layananLabel}`,
            }))}
          />
        </CardBody>
      </Card>

      {order && (
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader title="Timeline Pengantaran" subtitle={`Pesanan ${order.id}`} />
            <CardBody>
              {!hasBukti && (
                <EmptyState
                  icon={IoImageOutline}
                  title="Pengantaran belum selesai"
                  description="Bukti pengantaran belum tersedia. Kurir akan mengunggah foto setelah laundry diantar."
                  action={<StatusBadge status={order.status} />}
                />
              )}
              <Timeline items={timelineItems} />
            </CardBody>
          </Card>

          <Card className="h-fit">
            <CardHeader title="Detail Pesanan" />
            <CardBody className="space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Kode</span>
                <span className="font-semibold">{order.id}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Layanan</span>
                <span>{order.layananLabel}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Alamat</span>
                <span className="text-right">{order.alamat}</span>
              </div>
              <div className="flex justify-between gap-2 items-center">
                <span className="text-slate-500">Status</span>
                <StatusBadge status={order.status} />
              </div>
              {hasBukti && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">Waktu pengantaran</p>
                  <p className="font-semibold mt-1">{formatWaktu(order.bukti.waktu)}</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
