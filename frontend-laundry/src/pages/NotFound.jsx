import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb] p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <p className="text-gray-600 mt-4">Halaman tidak ditemukan.</p>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-6 px-6 py-3 rounded-xl bg-[#1565C0] text-white font-semibold hover:bg-[#0f4d8a]"
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  );
}
