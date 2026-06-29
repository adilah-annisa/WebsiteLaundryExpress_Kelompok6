import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useToast } from "../../context/ToastContext";
import PaymentCard from "../../components/PaymentCard";
import OrderCard from "../../components/OrderCard";
import Select from "../../components/ui/Select";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";

export default function DetailBiaya() {
  const { user } = useAuth();
  const { getOrdersForCustomer, updateOrder } = useData();
  const { showToast } = useToast();
  const orders = getOrdersForCustomer(user.customerId);

  const [selectedOrder, setSelectedOrder] = useState(orders[0]?.id || "");

  const order = useMemo(
    () => orders.find((o) => o.id === selectedOrder),
    [orders, selectedOrder]
  );

  const handlePay = (o) => {
    updateOrder(o.id, { paymentStatus: "Lunas" });
    showToast(`Pembayaran ${o.id} berhasil dicatat.`, "success");
  };

  if (!orders.length) {
    return (
      <Card>
        <CardBody>
          <p className="text-center text-slate-500 py-8">Belum ada pesanan.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-3">
          <Select
            label="Pilih Pesanan"
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
            options={orders.map((o) => ({ value: o.id, label: `${o.id} — ${o.layananLabel}` }))}
          />
          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {orders.map((o) => (
              <OrderCard key={o.id} order={o} selected={o.id === selectedOrder} onClick={() => setSelectedOrder(o.id)} />
            ))}
          </div>
        </div>
        <PaymentCard order={order} onPay={handlePay} />
      </div>
    </div>
  );
}
