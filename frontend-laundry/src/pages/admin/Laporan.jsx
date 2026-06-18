import { useMemo, useState } from "react";
import {
  IoCubeOutline,
  IoShirtOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import StatCard from "../../components/StatCard";

const monthlyData = [
  { bulan: "Jan", nilai: 85 },
  { bulan: "Feb", nilai: 72 },
  { bulan: "Mar", nilai: 90 },
  { bulan: "Apr", nilai: 78 },
  { bulan: "Mei", nilai: 95 },
  { bulan: "Jun", nilai: 88 },
];

export default function Laporan() {
  const [toast, setToast] = useState("");
  const maxNilai = Math.max(...monthlyData.map((d) => d.nilai));

  const summary = useMemo(() => {
    const completedOrders = 1180;
    const monthlyGrowth = 12;
    return [
      { label: "Pendapatan Bulanan", value: "Rp 1.248.000", color: "#10b981", bgIcon: "bg-green-50", icon: IoCubeOutline },
      { label: "Pendapatan Mingguan", value: "Rp 300.000", color: "#3b82f6", bgIcon: "bg-blue-50", icon: IoShirtOutline },
      { label: "Pertumbuhan", value: `${monthlyGrowth}%`, color: "#f59e0b", bgIcon: "bg-yellow-50", icon: IoTimeOutline },
      { label: "Pesanan Selesai", value: completedOrders, color: "#22c55e", bgIcon: "bg-emerald-50", icon: IoCheckmarkCircleOutline },
    ];
  }, []);

  const handleExport = () => {
    setToast("Laporan PDF sedang disiapkan...");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl bg-slate-900 text-white px-5 py-3 text-sm font-inter-semibold shadow-lg">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {summary.map((item, index) => (
          <StatCard key={index} icon={item.icon} label={item.label} value={item.value} color={item.color} bgIcon={item.bgIcon} />
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-inter-semibold text-slate-900">Ringkasan Laporan Pendapatan</h2>
            <p className="mt-1 text-sm text-slate-500">Lihat tren pendapatan bulanan dan kinerja laundry Anda.</p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-inter-semibold text-white hover:bg-slate-800 transition hover:scale-[1.02]"
          >
            Ekspor PDF
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Grafik Pendapatan (6 Bulan)</p>
            <div className="mt-8 h-72 flex items-end justify-between gap-3 px-2">
              {monthlyData.map((item) => (
                <div key={item.bulan} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full flex justify-center">
                    <div
                      className="w-full max-w-12 rounded-t-xl bg-linear-to-t from-[#1565C0] to-[#3b6fd8] transition-all duration-500 group-hover:opacity-90 group-hover:scale-y-105 origin-bottom"
                      style={{ height: `${(item.nilai / maxNilai) * 200}px` }}
                      title={`${item.bulan}: ${item.nilai}%`}
                    />
                  </div>
                  <span className="text-xs font-inter-semibold text-slate-600">{item.bulan}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-sm text-slate-500 uppercase tracking-[0.2em]">Rincian</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                {[
                  ["Total transaksi", "1.248"],
                  ["Pesanan selesai", "1.180"],
                  ["Pesanan dibatalkan", "23"],
                  ["Rata-rata order", "Rp 116.000"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span>{label}</span>
                    <span className="font-inter-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm text-slate-500 uppercase tracking-[0.2em]">Rekomendasi</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li>• Tambahkan promo paket selama minggu sepi.</li>
                <li>• Optimalkan jadwal kurir untuk rute populer.</li>
                <li>• Gunakan notifikasi SMS untuk pelanggan baru.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
