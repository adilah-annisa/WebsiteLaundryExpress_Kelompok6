import { useMemo, useState } from "react";
import ScheduleCard from "../../components/ScheduleCard";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { Alert } from "../../components/ui/Toast";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { IoCalendarOutline } from "react-icons/io5";

export default function JadwalPelanggan() {
  const { user } = useAuth();
  const { getOrdersForCustomer, slots, bookSlot } = useData();
  const { showToast } = useToast();

  const orders = getOrdersForCustomer(user.customerId);
  const pendingOrders = orders.filter((o) => !o.slotId && o.status === "Diproses");

  const [selectedOrderId, setSelectedOrderId] = useState(pendingOrders[0]?.id || "");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [error, setError] = useState("");

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const jenis = selectedOrder?.pengantaran === "antar" ? "antar" : "jemput";

  const availableSlots = useMemo(() => {
    return slots
      .filter((s) => s.jenis === jenis && s.terisi < s.kapasitas)
      .sort((a, b) => `${a.tanggal}${a.jam}`.localeCompare(`${b.tanggal}${b.jam}`));
  }, [slots, jenis]);

  const fullSlots = useMemo(() => {
    return slots.filter((s) => s.jenis === jenis && s.terisi >= s.kapasitas);
  }, [slots, jenis]);

  const bookedOrders = orders.filter((o) => o.slotId);

  const handleBook = () => {
    setError("");

    if (!selectedOrderId) {
      setError("Pilih pesanan terlebih dahulu.");
      return;
    }
    if (!selectedSlotId) {
      setError("Pilih slot jadwal yang tersedia.");
      return;
    }

    const slot = slots.find((s) => s.id === selectedSlotId);
    if (slot && slot.terisi >= slot.kapasitas) {
      setError("Slot penuh. Silakan pilih jadwal lain.");
      return;
    }

    const result = bookSlot(selectedOrderId, selectedSlotId);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    showToast(`Jadwal ${slot.tanggal} pukul ${slot.jam} berhasil dipilih.`, "success");
    setSelectedSlotId("");
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader
          title="Pilih Jadwal Antar-Jemput"
          subtitle="Pilih slot waktu yang tersedia untuk pesanan Anda."
        />
        <CardBody className="space-y-5">
          {error && <Alert variant="error">{error}</Alert>}

          {pendingOrders.length === 0 ? (
            <EmptyState
              icon={IoCalendarOutline}
              title="Tidak ada pesanan menunggu jadwal"
              description="Semua pesanan sudah memiliki jadwal, atau belum ada pesanan baru."
            />
          ) : (
            <Select
              label="Pilih Pesanan"
              value={selectedOrderId}
              onChange={(e) => {
                setSelectedOrderId(e.target.value);
                setSelectedSlotId("");
                setError("");
              }}
              options={pendingOrders.map((o) => ({
                value: o.id,
                label: `${o.id} — ${o.layananLabel} (${o.pengantaran === "jemput" ? "Jemput" : "Antar"})`,
              }))}
            />
          )}

          {selectedOrder && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Slot Tersedia ({jenis === "jemput" ? "Penjemputan" : "Pengantaran"})
                </h3>
                {availableSlots.length === 0 ? (
                  <EmptyState
                    icon={IoCalendarOutline}
                    title="Tidak ada slot tersedia"
                    description="Hubungi pemilik laundry untuk menambah jadwal."
                  />
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {availableSlots.map((slot) => (
                      <ScheduleCard
                        key={slot.id}
                        slot={slot}
                        selected={selectedSlotId === slot.id}
                        onSelect={(s) => setSelectedSlotId(s.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {fullSlots.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 mb-2">Slot Penuh (tidak dapat dipilih)</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {fullSlots.map((slot) => (
                      <ScheduleCard key={slot.id} slot={slot} disabled />
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={handleBook} disabled={!selectedSlotId || pendingOrders.length === 0}>
                Simpan Jadwal
              </Button>
            </>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Jadwal Pesanan Saya" subtitle="Daftar pesanan yang sudah memiliki slot." />
        <CardBody>
          <Table
            columns={[
              { key: "id", label: "Kode" },
              { key: "layananLabel", label: "Layanan" },
              { key: "tanggal", label: "Tanggal" },
              { key: "jam", label: "Jam" },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            ]}
            data={bookedOrders}
            emptyMessage="Belum ada jadwal terpilih."
          />
        </CardBody>
      </Card>
    </div>
  );
}
