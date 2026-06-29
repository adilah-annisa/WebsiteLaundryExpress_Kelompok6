import {
  MdSpaceDashboard,
  MdOutlineSchedule,
  MdOutlineLocalLaundryService,
  MdPayments,
  MdPersonOutline,
} from "react-icons/md";
import { GoListOrdered } from "react-icons/go";
import { FaHistory, FaCheckCircle } from "react-icons/fa";
import { IoReceiptOutline } from "react-icons/io5";

export const customerMenuItems = [
  { icon: MdSpaceDashboard, label: "Dashboard", path: "/pelanggan", end: true },
  { icon: GoListOrdered, label: "Pesan Laundry", path: "/pelanggan/pemesanan" },
  { icon: MdOutlineSchedule, label: "Jadwal", path: "/pelanggan/jadwal" },
  { icon: MdPayments, label: "Detail Biaya", path: "/pelanggan/biaya" },
  { icon: FaHistory, label: "Riwayat", path: "/pelanggan/riwayat" },
  { icon: FaCheckCircle, label: "Konfirmasi Laundry", path: "/pelanggan/konfirmasi" },
  { icon: IoReceiptOutline, label: "Bukti Pengantaran", path: "/pelanggan/bukti" },
  { icon: MdOutlineLocalLaundryService, label: "Status Laundry", path: "/pelanggan/status" },
  { icon: MdPersonOutline, label: "Profil", path: "/pelanggan/profil" },
];
