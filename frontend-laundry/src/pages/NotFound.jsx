import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-center px-4"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Mesin cuci animasi */}
      <div className="relative w-36 h-36 mb-8">
        {/* Gelembung */}
        <div className="absolute w-3 h-3 rounded-full bg-blue-300 opacity-70 -top-1 left-5 animate-bounce" />
        <div className="absolute w-2 h-2 rounded-full bg-blue-300 opacity-70 top-3 -right-1 animate-bounce delay-150" />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-blue-300 opacity-70 -bottom-1 left-2 animate-bounce delay-300" />

        {/* Drum putar */}
        <div className="w-36 h-36 rounded-full bg-blue-700 border-4 border-blue-800 flex items-center justify-center animate-spin"
          style={{ animationDuration: "4s" }}>
          <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-dashed border-blue-300 flex items-center justify-center text-3xl">
            💧
          </div>
        </div>
      </div>

      {/* Badge */}
      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1 rounded-full mb-4 tracking-wide">
        Laundry App
      </span>

      {/* Kode 404 */}
      <h1 className="text-8xl font-extrabold text-blue-700 leading-none tracking-tighter mb-2">
        404
      </h1>

      {/* Judul */}
      <h2 className="text-xl font-bold text-blue-900 mb-2">
        Halaman Tidak Ditemukan
      </h2>

      {/* Deskripsi */}
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-8">
        Seperti cucian yang nyasar, halaman ini tidak bisa kami temukan.
        Mungkin sudah selesai dicuci dan diambil duluan! 🧺
      </p>

      {/* Tombol kembali */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200"
      >
        ← Kembali ke Dashboard
      </button>

      {/* Ikon baju-bajuan */}
      <div className="flex gap-3 mt-8 text-2xl opacity-40">
        <span>👕</span>
        <span>👖</span>
        <span>🧦</span>
        <span>👗</span>
      </div>
    </div>
  );
}