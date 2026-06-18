import React, { Suspense, lazy } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";
import { useAuth } from "./context/AuthContext";

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Pesanan = lazy(() => import("./pages/admin/Pesanan"));
const Jadwal = lazy(() => import("./pages/admin/Jadwal"));
const Keuangan = lazy(() => import("./pages/admin/Keuangan"));
const Laporan = lazy(() => import("./pages/admin/Laporan"));
const PelangganAdmin = lazy(() => import("./pages/admin/Pelanggan"));

const PelangganLayout = lazy(() => import("./layouts/PelangganLayout"));
const DashboardPelanggan = lazy(() => import("./pages/pelanggan/DashboardPelanggan"));
const Pemesanan = lazy(() => import("./pages/pelanggan/Pemesanan"));
const StatusLaundry = lazy(() => import("./pages/pelanggan/StatusLaundry"));
const RiwayatTransaksi = lazy(() => import("./pages/pelanggan/RiwayatTransaksi"));
const BuktiPengantaran = lazy(() => import("./pages/pelanggan/BuktiPengantaran"));
const PelangganJadwal = lazy(() => import("./pages/pelanggan/Jadwal"));

const KurirLayout = lazy(() => import("./layouts/KurirLayout"));
const DashboardKurir = lazy(() => import("./pages/kurir/DashboardKurir"));
const Jemput = lazy(() => import("./pages/kurir/Jemput"));
const Antar = lazy(() => import("./pages/kurir/Antar"));
const UploadBukti = lazy(() => import("./pages/kurir/UploadBukti"));

const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

function RootRedirect() {
  const { user, ready, isAuthenticated } = useAuth();
  if (!ready) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user.role === "pelanggan") return <Navigate to="/pelanggan" replace />;
  if (user.role === "kurir") return <Navigate to="/kurir" replace />;
  return <Navigate to="/dashboard" replace />;
}

function LoginRoute() {
  const { user, ready, isAuthenticated } = useAuth();
  if (!ready) return <Loading />;
  if (isAuthenticated) {
    return <Navigate to={user.redirect || "/"} replace />;
  }
  return <Login />;
}

function RegisterRoute() {
  const { ready, isAuthenticated, user } = useAuth();
  if (!ready) return <Loading />;
  if (isAuthenticated) {
    return <Navigate to={user.redirect || "/"} replace />;
  }
  return <Register />;
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/register" element={<RegisterRoute />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="pesanan" element={<Pesanan />} />
          <Route path="jadwal" element={<Jadwal />} />
          <Route path="keuangan" element={<Keuangan />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="pelanggan-admin" element={<PelangganAdmin />} />
        </Route>

        {/* Legacy admin paths redirect */}
        <Route path="/pesanan" element={<Navigate to="/dashboard/pesanan" replace />} />
        <Route path="/jadwal" element={<Navigate to="/dashboard/jadwal" replace />} />
        <Route path="/keuangan" element={<Navigate to="/dashboard/keuangan" replace />} />
        <Route path="/laporan" element={<Navigate to="/dashboard/laporan" replace />} />
        <Route path="/pelanggan-admin" element={<Navigate to="/dashboard/pelanggan-admin" replace />} />

        <Route
          path="/pelanggan"
          element={
            <ProtectedRoute allowedRoles={["pelanggan"]}>
              <PelangganLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPelanggan />} />
          <Route path="pemesanan" element={<Pemesanan />} />
          <Route path="jadwal" element={<PelangganJadwal />} />
          <Route path="status" element={<StatusLaundry />} />
          <Route path="riwayat" element={<RiwayatTransaksi />} />
          <Route path="bukti" element={<BuktiPengantaran />} />
        </Route>

        <Route
          path="/kurir"
          element={
            <ProtectedRoute allowedRoles={["kurir"]}>
              <KurirLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardKurir />} />
          <Route path="jemput" element={<Jemput />} />
          <Route path="antar" element={<Antar />} />
          <Route path="bukti" element={<UploadBukti />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
