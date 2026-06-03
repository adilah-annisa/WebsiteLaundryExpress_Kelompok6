import { Link } from "react-router-dom";

export default function Register() {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">Daftar Pelanggan</h2>
                <p className="text-gray-500 text-sm">Buat akun pelanggan untuk pesan laundry dengan cepat.</p>
            </div>

            <form className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                        placeholder="Contoh: Budi Santoso"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                        placeholder="email@contoh.com"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor Telepon
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                        placeholder="0812xxxxxxxx"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                        placeholder="Buat password kamu"
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Konfirmasi Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                        placeholder="Ulangi password kamu"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all"
                >
                    Daftar Sekarang
                </button>
            </form>

            <p className="text-center text-sm text-gray-500">
                Sudah punya akun? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Masuk</Link>
            </p>
        </div>
    )
}
