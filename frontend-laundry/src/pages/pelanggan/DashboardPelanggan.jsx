import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import StatusBadge from "../../components/StatusBadge";
import StatCard from "../../components/StatCard";
import RoleShortcuts from "../../components/RoleShortcuts";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import {
  IoShirtOutline,
  IoCubeOutline,
  IoTimeOutline,
  IoCloseCircleOutline,
  IoCheckmarkCircleOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";

export default function DashboardPelanggan() {
  const { user } = useAuth();
  const { getOrdersForCustomer } = useData();
  const orders = getOrdersForCustomer(user.customerId);

  const stats = [
    { label: "Total Pesanan", value: String(orders.length), icon: IoShirtOutline, color: "#3B82F6", bgIcon: "bg-blue-50" },
    { label: "Selesai", value: String(orders.filter((o) => o.status === "Selesai").length), icon: IoCubeOutline, color: "#22C55E", bgIcon: "bg-green-50" },
    { label: "Diproses", value: String(orders.filter((o) => ["Diproses", "Dijemput", "Diantar"].includes(o.status)).length), icon: IoTimeOutline, color: "#F59E0B", bgIcon: "bg-yellow-50" },
    { label: "Menunggu Jadwal", value: String(orders.filter((o) => !o.slotId && o.status === "Diproses").length), icon: IoCloseCircleOutline, color: "#EF4444", bgIcon: "bg-red-50" },
  ];

  const activeOrders = orders.filter((o) => o.status !== "Selesai");
  const confirmableOrders = orders.filter((o) => o.status === "Diantar" && o.bukti?.foto);

  return (
    <div className="w-full max-w-screen-2xl mx-auto space-y-8">
      <RoleShortcuts role="pelanggan" />

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} icon={stat.icon} label={stat.label} value={stat.value} color={stat.color} bgIcon={stat.bgIcon} />
          ))}
        </div>

        <Card>
          <CardHeader title="Apa yang terjadi sekarang" subtitle="Ikhtisar singkat alur pesanan Anda" />
          <CardBody className="space-y-4">
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">Langkah selanjutnya</p>
                <p className="text-sm text-slate-500 mt-1">Pesanan dibuat → Laundry diproses → Kurir upload bukti → Anda konfirmasi selesai.</p>
              </div>

              {confirmableOrders.length > 0 ? (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-800">Konfirmasi menunggu</p>
                  <p className="text-sm text-blue-700 mt-2">Ada {confirmableOrders.length} pesanan dalam status Diantar dengan bukti, silakan konfirmasi.</p>
                  <Link to="/pelanggan/konfirmasi" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1565C0] hover:text-[#0f4d8a]">
                    Buka Konfirmasi <IoChevronForwardOutline />
                  </Link>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-700">Belum ada konfirmasi saat ini</p>
                  <p className="text-sm text-slate-500 mt-2">Jika bukti antar/jemput tersedia, halaman Konfirmasi Penerimaan akan menampilkan pesanan Anda.</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader title="Pesanan Aktif" subtitle="Daftar pesanan yang masih dalam perjalanan atau diproses" />
          <CardBody>
            {activeOrders.length === 0 ? (
              <EmptyState
                icon={IoCheckmarkCircleOutline}
                title="Tidak ada pesanan aktif"
                description="Semua pesanan Anda telah selesai. Buat pesanan baru jika ingin menggunakan layanan lagi."
                action={<Link to="/pelanggan/pemesanan" className="inline-flex items-center rounded-xl bg-[#1565C0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f4d8a]">Buat Pesanan Baru</Link>}
              />
            ) : (
              <div className="space-y-4">
                {activeOrders.slice(0, 4).map((order) => (
                  <div key={order.id} className="rounded-2xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500">{order.id}</p>
                        <p className="text-base font-semibold text-slate-900 truncate">{order.layananLabel || order.layanan || "Jenis layanan"}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-slate-600">
                      <div>
                        <p className="font-medium text-slate-700">Pengantaran</p>
                        <p>{order.pengantaran === "jemput" ? "Penjemputan" : order.pengantaran === "antar" ? "Pengantaran" : "Antar-Jemput"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">Alamat</p>
                        <p className="truncate">{order.alamat}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Alur Pesanan" subtitle="Tahapan yang sudah dan akan berlangsung" />
          <CardBody className="space-y-4">
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">1. Order dibuat</p>
                <p className="text-sm text-slate-500 mt-1">Pesanan Anda telah dikirim ke sistem dan sedang diproses.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">2. Kurir mengunggah bukti</p>
                <p className="text-sm text-slate-500 mt-1">Setelah laundry siap, kurir akan mengunggah foto bukti antar/jemput.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">3. Konfirmasi selesai</p>
                <p className="text-sm text-slate-500 mt-1">Buka halaman Konfirmasi Penerimaan untuk menyelesaikan pesanan setelah bukti tersedia.</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
