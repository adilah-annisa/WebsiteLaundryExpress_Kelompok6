  import { Routes, Route } from "react-router-dom";

  import MainLayout from "./DashboardAdmin/layouts/MainLayout";
  import AuthLayout from "./DashboardAdmin/layouts/AuthLayout";

  import Dashboard from "./pages/Dashboard";
  import Pesanan from "./pages/Pesanan";
  import Jadwal from "./pages/Jadwal";
  import Keuangan from "./pages/Keuangan";
  import NotFound from "./pages/NotFound";

  import Login from "./DashboardAdmin/layouts/Login";
  import Register from "./DashboardAdmin/layouts/Register";
  import Forgot from "./DashboardAdmin/layouts/Forgot";

  export default function App() {
    return (
      <Routes>

        {/* Dashboard */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pesanan" element={<Pesanan />} />
          <Route path="jadwal" element={<Jadwal />} />
          <Route path="keuangan" element={<Keuangan />} />
        </Route>

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    );
  }