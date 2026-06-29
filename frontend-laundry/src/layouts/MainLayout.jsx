import AdminLayout from "./AdminLayout";
import Sidebar from "../components/layout/Sidebar";
import { adminMenuItems } from "../config/adminMenu";

export default function MainLayout() {
  return (
    <AdminLayout sidebar={Sidebar} menuItems={adminMenuItems} brand="Admin Panel" />
  );
}
