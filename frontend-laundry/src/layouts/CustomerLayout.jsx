import AdminLayout from "./AdminLayout";
import Sidebar from "../components/layout/Sidebar";
import { customerMenuItems } from "../config/customerMenu";

const CUSTOMER_TITLES = {
  "/pelanggan": { title: "Dashboard Pelanggan", subtitle: "Ringkasan pesanan Anda" },
  "/pelanggan/pemesanan": { title: "Pesan Laundry", subtitle: "Form pemesanan layanan" },
  "/pelanggan/jadwal": { title: "Jadwal Antar-Jemput", subtitle: "Pilih slot waktu" },
  "/pelanggan/biaya": { title: "Detail Biaya", subtitle: "Rincian pembayaran" },
  "/pelanggan/riwayat": { title: "Riwayat", subtitle: "Histori pesanan" },
  "/pelanggan/konfirmasi": { title: "Konfirmasi Laundry", subtitle: "Konfirmasi penerimaan" },
  "/pelanggan/bukti": { title: "Bukti Pengantaran", subtitle: "Dokumentasi pengantaran" },
  "/pelanggan/status": { title: "Status Laundry", subtitle: "Lacak progres cucian" },
  "/pelanggan/profil": { title: "Profil", subtitle: "Data akun pelanggan" },
};

export default function CustomerLayout() {
  return (
    <AdminLayout sidebar={Sidebar} menuItems={customerMenuItems} brand="Pelanggan" pageTitles={CUSTOMER_TITLES} />
  );
}
