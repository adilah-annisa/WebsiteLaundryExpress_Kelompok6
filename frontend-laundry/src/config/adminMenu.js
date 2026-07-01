import {
  MdSpaceDashboard,
  MdOutlineSchedule,
  MdAttachMoney,
  MdBarChart,
  MdPersonOutline,
  MdSettings,
} from "react-icons/md";
import { GoListOrdered } from "react-icons/go";

export const adminMenuItems = [
  { icon: MdSpaceDashboard, label: "Dashboard", path: "/dashboard", end: true },
  { icon: GoListOrdered, label: "Kelola Pesanan", path: "/dashboard/pesanan" },
  { icon: MdOutlineSchedule, label: "Kelola Jadwal", path: "/dashboard/jadwal" },
  { icon: MdAttachMoney, label: "Kelola Transaksi", path: "/dashboard/keuangan" },
  { icon: MdBarChart, label: "Laporan", path: "/dashboard/laporan" },
  { icon: MdSettings, label: "Pengaturan", path: "/dashboard/pengaturan" },
];
