import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Loading from "./components/Loading";

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Pesanan = lazy(() => import("./pages/admin/Pesanan"));
const Jadwal = lazy(() => import("./pages/admin/Jadwal"));
const Keuangan = lazy(() => import("./pages/admin/Keuangan"));

const PelangganLayout = lazy(() => import("./layouts/PelangganLayout"));
const DashboardPelanggan = lazy(() => import("./pages/pelanggan/DashboardPelanggan"));
const Pemesanan = lazy(() => import("./pages/pelanggan/Pemesanan"));
const StatusLaundry = lazy(() => import("./pages/pelanggan/StatusLaundry"));
const RiwayatTransaksi = lazy(() => import("./pages/pelanggan/RiwayatTransaksi"));
const BuktiPengantaran = lazy(() => import("./pages/pelanggan/BuktiPengantaran"));

const KurirLayout = lazy(() => import("./layouts/KurirLayout"));
const DashboardKurir = lazy(() => import("./pages/kurir/DashboardKurir"));
const Jemput = lazy(() => import("./pages/kurir/Jemput"));
const Antar = lazy(() => import("./pages/kurir/Antar"));
const UploadBukti = lazy(() => import("./pages/kurir/UploadBukti"));

const NotFound = lazy(() => import("./pages/NotFound"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot = lazy(() => import("./pages/auth/Forgot"));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pesanan" element={<Pesanan />} />
          <Route path="jadwal" element={<Jadwal />} />
          <Route path="keuangan" element={<Keuangan />} />
          <Route path="products/:id" element={<ProductDetail />} />
        </Route>

        <Route path="/pelanggan" element={<PelangganLayout />}>
          <Route index element={<DashboardPelanggan />} />
          <Route path="pemesanan" element={<Pemesanan />} />
          <Route path="status" element={<StatusLaundry />} />
          <Route path="riwayat" element={<RiwayatTransaksi />} />
          <Route path="bukti" element={<BuktiPengantaran />} />
        </Route>

        <Route path="/kurir" element={<KurirLayout />}>
          <Route index element={<DashboardKurir />} />
          <Route path="jemput" element={<Jemput />} />
          <Route path="antar" element={<Antar />} />
          <Route path="bukti" element={<UploadBukti />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}