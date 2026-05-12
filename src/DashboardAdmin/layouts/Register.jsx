export default function Register() {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Join the Team ✨</h2>
                <p className="text-gray-500 text-sm">Daftarkan akun admin baru Anda.</p>
            </div>

            <form className="space-y-4">
                <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="Nama Lengkap"
                />
                <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="Alamat Email"
                />
                <input
                    type="password"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="Buat Password"
                />
                
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all"
                >
                    Buat Akun
                </button>
            </form>
        </div>
    )
}