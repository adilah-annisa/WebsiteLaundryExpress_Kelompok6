export default function Login() {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
                <p className="text-gray-500 text-sm">Ayo kelola pesanan laundry hari ini.</p>
            </div>

            <form className="space-y-4">
                <div>
                    <label className="text-sm font-bold text-gray-700 ml-1">Email Admin</label>
                    <input
                        type="email"
                        className="w-full mt-1 px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-0 transition-all outline-none"
                        placeholder="admin@laundry.com"
                    />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                    <input
                        type="password"
                        className="w-full mt-1 px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-0 transition-all outline-none"
                        placeholder="••••••••"
                    />
                </div>
                
                <div className="text-right text-xs">
                    <a href="/forgot" className="text-blue-600 font-semibold hover:underline">Lupa Password?</a>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-300 transform hover:-translate-y-0.5 active:scale-95"
                >
                    Masuk Sekarang
                </button>
            </form>
        </div>
    )
}