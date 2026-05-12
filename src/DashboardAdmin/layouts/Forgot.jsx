export default function Forgot() {
    return (
        <div className="space-y-6 text-center">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Waduh, Lupa? 😅</h2>
                <p className="text-gray-500 text-sm mt-2">
                    Tenang, masukkan email Anda di bawah, kami kirimkan kunci rahasia baru.
                </p>
            </div>

            <form className="space-y-4 text-left">
                <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="email@kamu.com"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all"
                >
                    Kirim Link Pemulihan
                </button>
            </form>
            
            <a href="/login" className="inline-block text-sm font-semibold text-blue-600 hover:text-blue-800">
                ← Kembali ke Login
            </a>
        </div>
    )
}