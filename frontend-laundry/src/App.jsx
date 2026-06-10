import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Loading from "./components/Loading";

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Pesanan = lazy(() => import("./pages/admin/Pesanan"));
const Jadwal = lazy(() => import("./pages/admin/Jadwal"));
const Keuangan = lazy(() => import("./pages/admin/Keuangan"));

const NotFound = lazy(() => import("./pages/NotFound"));

const ProductDetail = lazy(() => import("./pages/ProductDetail"));


const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot = lazy(() => import("./pages/auth/Forgot"));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* Dashboard */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pesanan" element={<Pesanan />} />
          <Route path="jadwal" element={<Jadwal />} />
          <Route path="keuangan" element={<Keuangan />} />

          <Route path="products/:id" element={<ProductDetail />} />
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
    </Suspense>
  );
}
