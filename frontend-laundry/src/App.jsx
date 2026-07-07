import React, { Suspense, lazy } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";
import { useAuth } from "./context/AuthContext";

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const CustomerLayout = lazy(() => import("./layouts/CustomerLayout"));
const CourierLayout = lazy(() => import("./layouts/CourierLayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const ErrorLayout = lazy(() => import("./layouts/ErrorLayout"));

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Pesanan = lazy(() => import("./pages/admin/Pesanan"));
const Jadwal = lazy(() => import("./pages/admin/Jadwal"));
const Keuangan = lazy(() => import("./pages/admin/Keuangan"));

const Pengaturan = lazy(() => import("./pages/admin/Pengaturan"));

const DashboardPelanggan = lazy(() => import("./pages/pelanggan/DashboardPelanggan"));
const Pemesanan = lazy(() => import("./pages/pelanggan/Pemesanan"));
const DetailBiaya = lazy(() => import("./pages/pelanggan/DetailBiaya"));
const RiwayatLaundry = lazy(() => import("./pages/pelanggan/RiwayatLaundry"));
const KonfirmasiLaundry = lazy(() => import("./pages/pelanggan/KonfirmasiLaundry"));
const ProfilPelanggan = lazy(() => import("./pages/pelanggan/Profil"));

const DashboardKurir = lazy(() => import("./pages/kurir/DashboardKurir"));
const AntarJemput = lazy(() => import("./pages/kurir/AntarJemput"));
const UploadBukti = lazy(() => import("./pages/kurir/UploadBukti"));
const ProfilKurir = lazy(() => import("./pages/kurir/ProfilKurir"));

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
  if (isAuthenticated) return <Navigate to={user.redirect || "/dashboard"} replace />;
  return <Login />;
}

function RegisterRoute() {
  const { ready, isAuthenticated, user } = useAuth();
  if (!ready) return <Loading />;
  if (isAuthenticated) return <Navigate to={user.redirect || "/dashboard"} replace />;
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

          <Route path="pengaturan" element={<Pengaturan />} />
        </Route>

        <Route path="/pesanan" element={<Navigate to="/dashboard/pesanan" replace />} />
        <Route path="/jadwal" element={<Navigate to="/dashboard/jadwal" replace />} />
        <Route path="/keuangan" element={<Navigate to="/dashboard/keuangan" replace />} />
        <Route path="/laporan" element={<Navigate to="/dashboard" replace />} />


        <Route
          path="/pelanggan"
          element={
            <ProtectedRoute allowedRoles={["pelanggan"]}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPelanggan />} />
          <Route path="pemesanan" element={<Pemesanan />} />
          <Route path="biaya" element={<DetailBiaya />} />
          <Route path="riwayat" element={<RiwayatLaundry />} />
          <Route path="konfirmasi" element={<KonfirmasiLaundry />} />
          <Route path="profil" element={<ProfilPelanggan />} />
        </Route>

        <Route
          path="/kurir"
          element={
            <ProtectedRoute allowedRoles={["kurir"]}>
              <CourierLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardKurir />} />
          <Route path="antar-jemput" element={<AntarJemput />} />
          <Route path="bukti" element={<UploadBukti />} />
          <Route path="profil" element={<ProfilKurir />} />
        </Route>

        <Route element={<ErrorLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
