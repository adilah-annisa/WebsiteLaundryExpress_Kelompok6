import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useToast } from "../../context/ToastContext";
import OrderCard from "../../components/OrderCard";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/ui/Button";
import { ConfirmDialog } from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import { Card, CardBody } from "../../components/ui/Card";
import { IoCheckmarkCircleOutline, IoImageOutline } from "react-icons/io5";

export default function KonfirmasiLaundry() {
  const { user } = useAuth();
  const { getOrdersForCustomer, updateOrder } = useData();
  const { showToast } = useToast();

  const orders = getOrdersForCustomer(user.customerId);
  // Only orders that are Diantar and have bukti are confirmable
  const confirmable = useMemo(() => orders.filter((o) => o.status === "Diantar" && o.bukti?.foto), [orders]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleConfirm = () => {
    if (!selectedOrder) return;
    updateOrder(selectedOrder.id, { status: "Diterima Pelanggan" });
    setModalOpen(false);
    showToast(`Pesanan ${selectedOrder.id} berhasil dikonfirmasi diterima.`, "success");
    setSelectedOrder(null);
  };

  if (!confirmable.length) {
    return (
      <EmptyState
        icon={IoCheckmarkCircleOutline}
        title="Belum ada pesanan untuk dikonfirmasi"
        description="Pesanan akan muncul di sini setelah laundry siap diantar atau sudah diantar."
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {confirmable.map((order) => (
          <div key={order.id} className="space-y-3">
            <OrderCard order={order} onClick={() => setSelectedOrder(order)} selected={selectedOrder?.id === order.id} />
            {order.bukti?.foto ? (
              <img src={order.bukti.foto} alt="Bukti" className="w-full h-32 object-cover rounded-xl border" />
            ) : (
              <Card>
                <CardBody className="flex items-center gap-2 text-sm text-slate-500">
                  <IoImageOutline /> Bukti belum tersedia
                </CardBody>
              </Card>
            )}
            <div className="flex items-center justify-between">
              <StatusBadge status={order.status} />
              <Button size="sm" disabled={order.status !== "Diantar" || !order.bukti?.foto} onClick={() => { setSelectedOrder(order); setModalOpen(true); }}>
                Selesai
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        title="Konfirmasi Penerimaan"
        message={`Apakah Anda yakin telah menerima pesanan ${selectedOrder?.id}? Status akan diperbarui menjadi Selesai.`}
        confirmLabel="Ya, Terima"
      />
    </div>
  );
}
