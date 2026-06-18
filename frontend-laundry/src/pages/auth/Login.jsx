import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { AUTH_USERS } from "../../lib/constants";

const DEMO_ROLES = [
  { role: "admin",     label: "Pemilik",   icon: "👑" },
  { role: "pelanggan", label: "Pelanggan", icon: "🧺" },
  { role: "kurir",     label: "Kurir",     icon: "🛵" },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState(null);
  const [dataForm, setDataForm] = useState({ username: "", password: "" });

  /* inject keyframes once */
  useEffect(() => {
    const id = "le-login-kf";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @keyframes leShake {
        0%,100%{transform:translateX(0)}
        20%{transform:translateX(-5px)}
        40%{transform:translateX(5px)}
        60%{transform:translateX(-3px)}
        80%{transform:translateX(3px)}
      }
      @keyframes leSlideUp {
        from{opacity:0;transform:translateY(8px)}
        to{opacity:1;transform:none}
      }
      @keyframes lePop {
        0%{transform:scale(.75);opacity:0}
        60%{transform:scale(1.08)}
        100%{transform:scale(1);opacity:1}
      }
    `;
    document.head.appendChild(s);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm((p) => ({ ...p, [name]: value }));
    if (error) setError("");
  };

  const fillDemo = (role) => {
    const u = Object.values(AUTH_USERS).find((u) => u.role === role);
    if (u) setDataForm({ username: u.username, password: u.password });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || success) return;

    if (!dataForm.username.trim() || !dataForm.password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 850));

    const result = login(dataForm.username, dataForm.password);
    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);
    await new Promise((r) => setTimeout(r, 650));
    navigate(result.redirect, { replace: true });
  };

  /* input border style */
  const inputCls = (field) =>
    [
      "w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm transition-all outline-none text-gray-800 placeholder-gray-400",
      focused === field
        ? "border-blue-400 ring-2 ring-blue-100 bg-white"
        : "border-gray-200 bg-gray-50 hover:border-gray-300",
    ].join(" ");

  return (
    <div style={{ animation: "leSlideUp 350ms ease both" }}>

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200"
          style={{ background: "linear-gradient(135deg,#2563eb,#3b82f6)" }}>
          🧺
        </div>
        <div>
          <p className="font-bold text-gray-800 text-sm leading-tight">Laundry Express</p>
          <p className="text-[11px] text-gray-400">Portal Manajemen</p>
        </div>
      </div>

      <h2 className="text-xl font-extrabold text-gray-900">Masuk ke akun</h2>
      <p className="text-sm text-gray-500 mt-0.5 mb-5">Pilih akun demo atau isi kredensial kamu.</p>

      {/* ── Alerts ── */}
      <div className="min-h-[44px] mb-3">
        {error && (
          <div
            className="flex items-start gap-2 px-3.5 py-2.5 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-xs"
            style={{ animation: "leShake .35s ease" }}
          >
            <BsFillExclamationDiamondFill className="shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}
        {loading && !error && (
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 text-xs">
            <ImSpinner2 className="animate-spin shrink-0" />
            <span>Memeriksa kredensial...</span>
          </div>
        )}
        {success && (
          <div
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs"
            style={{ animation: "lePop .3s ease" }}
          >
            <HiOutlineCheckCircle className="shrink-0 text-emerald-500 text-base" />
            <span>Berhasil masuk! Mengalihkan...</span>
          </div>
        )}
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-xs font-semibold text-gray-600 mb-1">
            Username
          </label>
          <div className="relative">
            <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              id="username"
              name="username"
              type="text"
              value={dataForm.username}
              onChange={handleChange}
              onFocus={() => setFocused("username")}
              onBlur={() => setFocused(null)}
              placeholder="admin / pelanggan / kurir"
              autoComplete="username"
              className={inputCls("username")}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-gray-600 mb-1">
            Password
          </label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              id="password"
              name="password"
              type={showPass ? "text" : "password"}
              value={dataForm.password}
              onChange={handleChange}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`${inputCls("password")} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPass ? <HiOutlineEyeOff /> : <HiOutlineEye />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || success}
          className={[
            "w-full py-2.5 rounded-2xl text-sm font-bold text-white transition-all duration-200",
            success
              ? "bg-emerald-500 cursor-default"
              : loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-blue-200 hover:shadow-blue-300",
          ].join(" ")}
        >
          {success ? "✓ Berhasil masuk!" : loading ? "Memeriksa..." : "Masuk Sekarang →"}
        </button>
      </form>

      {/* ── Demo quick-fill ── */}
      <div className="mt-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[11px] text-gray-400 font-medium">Akun demo</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {DEMO_ROLES.map(({ role, label, icon }) => (
            <button
              key={role}
              type="button"
              onClick={() => fillDemo(role)}
              className="flex flex-col items-center gap-0.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all active:scale-95"
            >
              <span className="text-base">{icon}</span>
              <span className="text-[11px] font-bold text-gray-700">{label}</span>
              <span className="text-[10px] text-gray-400 font-mono">{role}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Register link ── */}
      <p className="text-center text-xs text-gray-400 mt-5">
        Belum punya akun?{" "}
        <span
          role="link"
          tabIndex={0}
          onClick={() => navigate("/register")}
          onKeyDown={(e) => { if (e.key === "Enter") navigate("/register"); }}
          className="text-blue-600 font-semibold hover:underline cursor-pointer"
        >
          Daftar sekarang
        </span>
      </p>
    </div>
  );
}
