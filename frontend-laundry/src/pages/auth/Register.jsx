﻿import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [dataForm, setDataForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const successFromQuery = params.get("success");
    if (successFromQuery) setSuccessMsg(successFromQuery);
  }, [location.search]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!dataForm.name.trim()) return "Nama lengkap wajib diisi.";
    if (!dataForm.email.trim()) return "Email wajib diisi.";
    if (!dataForm.phone.trim()) return "Nomor telepon wajib diisi.";
    if (!dataForm.password) return "Password wajib diisi.";
    if (!dataForm.confirmPassword) return "Konfirmasi password wajib diisi.";
    if (dataForm.password.length < 6) return "Password minimal 6 karakter.";
    if (dataForm.password !== dataForm.confirmPassword) return "Password dan konfirmasi password tidak sama.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const msg = validate();
      if (msg) {
        setError(msg);
        return;
      }

      setSuccessMsg(
        "Registrasi tampilan berhasil. Silakan masuk dengan akun demo atau buat login sesuai backend."
      );
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 900);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Daftar Pelanggan</h2>
        <p className="text-gray-500 text-xs sm:text-sm">Buat akun pelanggan untuk pesan laundry dengan cepat.</p>
      </div>

      <div className="space-y-2">
        {error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-100 p-3 text-xs sm:text-sm text-red-700 rounded-xl flex items-start gap-2 animate-[shakeIn_280ms_ease-out_both]"
          >
            <BsFillExclamationDiamondFill className="text-red-600 text-lg sm:text-xl shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {loading && (
          <div className="bg-green-50 border border-green-100 p-3 text-xs sm:text-sm text-green-700 rounded-xl flex items-center gap-2">
            <ImSpinner2 className="animate-spin text-green-700 text-base sm:text-lg" />
            <span>Mohon tunggu...</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 border border-green-100 p-3 text-xs sm:text-sm text-green-700 rounded-xl animate-[authIn_420ms_ease-out_both]">
            {successMsg}
          </div>
        )}
      </div>

      <form className="space-y-3.5 w-full" onSubmit={handleSubmit}>
        <div className="h-1 w-12 bg-green-500 rounded-full mb-4" />

        <div>
          <label htmlFor="name" className="text-xs sm:text-sm font-bold text-gray-700">
            Nama Lengkap
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={dataForm.name}
            onChange={handleChange}
            className="w-full mt-1 px-3.5 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
            placeholder="Contoh: Budi Santoso"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-xs sm:text-sm font-bold text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={dataForm.email}
            onChange={handleChange}
            className="w-full mt-1 px-3.5 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
            placeholder="email@contoh.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="phone" className="text-xs sm:text-sm font-bold text-gray-700">
            Nomor Telepon
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={dataForm.phone}
            onChange={handleChange}
            className="w-full mt-1 px-3.5 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
            placeholder="0812xxxxxxxx"
            autoComplete="tel"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-xs sm:text-sm font-bold text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={dataForm.password}
            onChange={handleChange}
            className="w-full mt-1 px-3.5 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
            placeholder="Buat password kamu"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="text-xs sm:text-sm font-bold text-gray-700">
            Konfirmasi Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={dataForm.confirmPassword}
            onChange={handleChange}
            className="w-full mt-1 px-3.5 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
            placeholder="Ulangi password kamu"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.8 sm:py-3.5 rounded-xl transition-all shadow-lg hover:shadow-green-300 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Daftar Sekarang
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}

