import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoLockClosedOutline, IoPersonOutline } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardBody } from "../../components/ui/Card";
import { Alert } from "../../components/ui/Toast";
import users from "../../data/Users.json";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    const result = await login(formData.username, formData.password);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    showToast("Login berhasil. Selamat datang!", "success");
    navigate(result.redirect, { replace: true });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Selamat Datang</h2>
        <p className="text-slate-500 text-sm mt-1">Masuk ke Laundry Express Management System</p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 rounded-xl px-4 py-3">
          <ImSpinner2 className="animate-spin" /> Memverifikasi...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="admin / pelanggan / kurir"
          icon={IoPersonOutline}
          autoComplete="username"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          icon={IoLockClosedOutline}
          autoComplete="current-password"
        />
        <Button type="submit" className="w-full" loading={loading}>
          Masuk Sekarang
        </Button>
      </form>

      <Card className="bg-slate-50 border-dashed">
        <CardBody className="text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-800">Akun demo:</p>
          {users.map((u) => (
            <p key={u.id}>
              {u.role === "admin" ? "Admin" : u.role === "pelanggan" ? "Pelanggan" : "Kurir"}:{" "}
              <span className="font-mono">{u.username}</span> / <span className="font-mono">{u.password}</span>
            </p>
          ))}
        </CardBody>
      </Card>

      <p className="text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
