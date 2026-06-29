import { MdSpaceDashboard, MdPersonOutline } from "react-icons/md";
import { HiArrowUpTray, HiArrowDownTray } from "react-icons/hi2";
import { IoCloudUploadOutline } from "react-icons/io5";

export const courierMenuItems = [
  { icon: MdSpaceDashboard, label: "Dashboard", path: "/kurir", end: true },
  { icon: HiArrowUpTray, label: "Jadwal Jemput", path: "/kurir/jemput" },
  { icon: HiArrowDownTray, label: "Jadwal Antar", path: "/kurir/antar" },
  { icon: IoCloudUploadOutline, label: "Upload Bukti", path: "/kurir/bukti" },
  { icon: MdPersonOutline, label: "Profil", path: "/kurir/profil" },
];
