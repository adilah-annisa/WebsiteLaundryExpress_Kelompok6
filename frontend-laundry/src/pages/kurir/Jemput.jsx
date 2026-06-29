import { useMemo, useState } from "react";
import ScheduleCard from "../../components/ScheduleCard";
import SearchBar from "../../components/ui/SearchBar";
import Button from "../../components/ui/Button";
import Modal, { ConfirmDialog } from "../../components/ui/Modal";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../context/ToastContext";
import { useData } from "../../context/DataContext";
import { IoMapOutline, IoCallOutline, IoTimeOutline, IoPersonOutline, IoBagOutline } from "react-icons/io5";

const STATUS_FLOW = ["Diproses", "Dijemput"];

export default function Jemput() {
  const { orders, updateOrder } = useData();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const tasks = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return orders
      .filter((o) => o.pengantaran === "jemput" && o.slotId && ["Diproses", "Dijemput"].includes(o.status))
      .map((o) => ({
        id: o.id,
        kode: o.id,
        nama: o.nama,
        alamat: o.alamat,
        telepon: o.nohp,
        waktu: o.jam,
        tanggal: o.tanggal,
        jam: o.jam,
        status: o.status,
        jenis: "jemput",
        kapasitas: 1,
        terisi: 0,
        catatan: o.catatan,
      }))
      .filter((t) => [t.kode, t.nama, t.alamat].some((v) => v.toLowerCase().includes(q)));
  }, [orders, searchTerm]);

  const handleUpdateStatus = () => {
    if (!selectedOrder || !newStatus) return;
    updateOrder(selectedOrder.kode, { status: newStatus });
    setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
    setModalOpen(false);
    showToast(`Status ${selectedOrder.kode} diperbarui menjadi ${newStatus}`, "success");
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader title="Jadwal Penjemputan" subtitle={`${tasks.length} tugas penjemputan`} />
        <CardBody className="space-y-5">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Cari kode, nama, alamat..." />

          {tasks.length === 0 ? (
            <EmptyState
              icon={IoBagOutline}
              title="Belum ada tugas penjemputan"
              description="Pesanan dengan jadwal jemput akan muncul di sini."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => (
                <ScheduleCard key={task.id} slot={task} onSelect={() => setSelectedOrder(task)} />
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title="Detail Penjemputan"
        subtitle={selectedOrder?.kode}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
              <IoPersonOutline className="text-2xl text-blue-600 shrink-0" />
              <div>
                <p className="font-semibold">{selectedOrder.nama}</p>
                <a href={`tel:${selectedOrder.telepon}`} className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                  <IoCallOutline /> {selectedOrder.telepon}
                </a>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs uppercase text-slate-500 flex items-center gap-1"><IoMapOutline /> Alamat</p>
              <p className="text-sm mt-2">{selectedOrder.alamat}</p>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
              <span className="text-sm flex items-center gap-1"><IoTimeOutline /> {selectedOrder.tanggal} {selectedOrder.waktu}</span>
              <StatusBadge status={selectedOrder.status} />
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_FLOW.map((status) => (
                  <Button
                    key={status}
                    variant="secondary"
                    size="sm"
                    disabled={selectedOrder.status === status}
                    onClick={() => { setNewStatus(status); setModalOpen(true); }}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleUpdateStatus}
        title="Konfirmasi Update Status"
        message={`Ubah status ${selectedOrder?.kode} menjadi ${newStatus}?`}
        confirmLabel="Ya, Update"
      />
    </div>
  );
}
