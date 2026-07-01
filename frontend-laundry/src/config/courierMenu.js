import { MdSpaceDashboard, MdPersonOutline } from "react-icons/md";
import { GrDeliver } from "react-icons/gr";
import { IoCloudUploadOutline } from "react-icons/io5";

export const courierMenuItems = [
  { icon: MdSpaceDashboard, label: "Dashboard", path: "/kurir", end: true },
  { icon: GrDeliver, label: "Antar-Jemput", path: "/kurir/antar-jemput" },
  { icon: IoCloudUploadOutline, label: "Upload Bukti", path: "/kurir/bukti" },
  { icon: MdPersonOutline, label: "Profil", path: "/kurir/profil" },
];
