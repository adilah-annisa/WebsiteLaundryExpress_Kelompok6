import {
  MdSpaceDashboard,
  MdOutlineLocalLaundryService,
  MdPayments,
  MdPersonOutline,
} from "react-icons/md";
import { GoListOrdered } from "react-icons/go";
import { FaHistory } from "react-icons/fa";

export const customerMenuItems = [
  { icon: MdSpaceDashboard, label: "Dashboard", path: "/pelanggan", end: true },
  { icon: GoListOrdered, label: "Pesan Laundry", path: "/pelanggan/pemesanan" },
  { icon: FaHistory, label: "Riwayat Laundry", path: "/pelanggan/riwayat" },
  { icon: MdPayments, label: "Detail Biaya", path: "/pelanggan/biaya" },
  { icon: MdPersonOutline, label: "Profil", path: "/pelanggan/profil" },
];
