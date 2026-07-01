import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ScheduleCard from "../../components/ScheduleCard";
import SearchBar from "../../components/ui/SearchBar";
import Button from "../../components/ui/Button";
import Modal, { ConfirmDialog } from "../../components/ui/Modal";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../context/ToastContext";
import { useData } from "../../context/DataContext";
import { IoMapOutline, IoCallOutline, IoTimeOutline, IoPersonOutline } from "react-icons/io5";
import { GrDeliver } from "react-icons/gr";

const JEMPUT_STATUSES = ["Diproses", "Dijemput"];
const ANTAR_STATUSES = ["Siap Diantar", "Diantar"];

export default function AntarJemput() {
  const { orders, updateOrder } = useData();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const tasks = useMemo(() => {
    const q = searchTerm.toLowerCase();
    
    // Penjemputan tasks
    const pickupTasks = orders
      .filter((o) => o.pengantaran === "jemput" && o.slotId && JEMPUT_STATUSES.includes(o.status))
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
        jenisLayanan: "Jemput",
        kapasitas: 1,
        terisi: 0,
        catatan: o.catatan,
        orderId: o.id,
      }));

    // Pengantaran tasks (only Siap Diantar and Diantar)
    const deliveryTasks = orders
      .filter((o) => ANTAR_STATUSES.includes(o.status))
      .map((o) => ({
        id: o.id,
        kode: o.id,
        nama: o.nama,
        alamat: o.alamat,
        telepon: o.nohp,
        waktu: o.jam || "-",
        tanggal: o.tanggal || "-",
        jam: o.jam || "-",
        status: o.status,
        jenisLayanan: "Antar",
        kapasitas: 1,
        terisi: 0,
        catatan: o.catatan,
        orderId: o.id,
      }));

    // Antar-Jemput tasks
    const antarJemputTasks = orders
      .filter((o) => o.pengantaran === "antar-jemput" && o.slotId)
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
        jenisLayanan: "Antar-Jemput",
        kapasitas: 1,
        terisi: 0,
        catatan: o.catatan,
        orderId: o.id,
      }));

    const allTasks = [...pickupTasks, ...deliveryTasks, ...antarJemputTasks];
    
    return allTasks.filter((t) =>
      [t.kode, t.nama, t.alamat, t.jenisLayanan].some((v) =>
        v.toLowerCase().includes(q)
      )
    );
  }, [orders, searchTerm]);

  const getAvailableStatuses = (task) => {
    if (task.jenisLayanan === "Jemput") return JEMPUT_STATUSES;
    if (task.jenisLayanan === "Antar") return ANTAR_STATUSES;
    return [];
  };

  const handleUpdateStatus = () => {
    if (!selectedOrder || !newStatus) return;
    updateOrder(selectedOrder.orderId, { status: newStatus });
    setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
    setModalOpen(false);
    showToast(`Status ${selectedOrder.kode} diperbarui menjadi ${newStatus}`, "success");
  };

  const tasksByType = {
    jemput: tasks.filter((t) => t.jenisLayanan === "Jemput"),
    antar: tasks.filter((t) => t.jenisLayanan === "Antar"),
    antarJemput: tasks.filter((t) => t.jenisLayanan === "Antar-Jemput"),
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader
          title="Antar-Jemput"
          subtitle={`${tasks.length} total tugas`}
        />
        <CardBody className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Cari kode, nama, alamat, atau jenis..."
              className="flex-1"
            />
            <Link to="/kurir/bukti">
              <Button variant="secondary">Upload Bukti</Button>
            </Link>
          </div>

          {tasks.length === 0 ? (
            <EmptyState
              icon={GrDeliver}
              title="Belum ada tugas antar-jemput"
              description="Pesanan dengan status aktif akan muncul di sini."
            />
          ) : (
            <>
              {/* Jemput Section */}
              {tasksByType.jemput.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Penjemputan ({tasksByType.jemput.length})
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {tasksByType.jemput.map((task) => (
                      <ScheduleCard
                        key={task.id}
                        slot={task}
                        onSelect={() => setSelectedOrder(task)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Antar Section */}
              {tasksByType.antar.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Pengantaran ({tasksByType.antar.length})
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {tasksByType.antar.map((task) => (
                      <ScheduleCard
                        key={task.id}
                        slot={task}
                        onSelect={() => setSelectedOrder(task)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Antar-Jemput Section */}
              {tasksByType.antarJemput.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Antar-Jemput ({tasksByType.antarJemput.length})
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {tasksByType.antarJemput.map((task) => (
                      <ScheduleCard
                        key={task.id}
                        slot={task}
                        onSelect={() => setSelectedOrder(task)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      <Modal
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title="Detail Tugas"
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
              <p className="text-xs uppercase text-slate-500 flex items-center gap-1">
                <IoMapOutline /> Alamat
              </p>
              <p className="text-sm mt-2">{selectedOrder.alamat}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs uppercase text-slate-500">Jenis Layanan</p>
                <p className="text-sm font-semibold mt-1">{selectedOrder.jenisLayanan}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs uppercase text-slate-500 flex items-center gap-1">
                  <IoTimeOutline /> Jadwal
                </p>
                <p className="text-sm font-semibold mt-1">
                  {selectedOrder.tanggal} {selectedOrder.jam}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
              <span className="text-sm">Status:</span>
              <StatusBadge status={selectedOrder.status} />
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {getAvailableStatuses(selectedOrder).map((status) => (
                  <Button
                    key={status}
                    variant="secondary"
                    size="sm"
                    disabled={selectedOrder.status === status}
                    onClick={() => {
                      setNewStatus(status);
                      setModalOpen(true);
                    }}
                  >
                    {status}
                  </Button>
                ))}
              </div>
              {selectedOrder.status === "Diantar" && (
                <p className="text-xs text-blue-600 mt-2">
                  Jangan lupa{" "}
                  <Link to="/kurir/bukti" className="underline font-semibold">
                    upload bukti pengantaran
                  </Link>
                  .
                </p>
              )}
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
