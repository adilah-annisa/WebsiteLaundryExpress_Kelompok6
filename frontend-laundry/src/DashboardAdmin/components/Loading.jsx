export default function Loading() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
            <div className="relative flex items-center justify-center">
                {/* Lingkaran Spinner Luar */}
                <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                
                {/* Ikon di Tengah (Opsional: Ikon Baju atau Air) */}
                <div className="absolute">
                    <svg 
                        className="w-8 h-8 text-blue-600 animate-pulse" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
                        />
                    </svg>
                </div>
            </div>

            {/* Teks Loading dengan Animasi Titik-titik */}
            <div className="mt-6 text-center">
                <h2 className="text-xl font-bold text-gray-800 tracking-wide">
                    Laundry<span className="text-blue-600">Express</span>
                </h2>
                <p className="text-gray-400 text-sm mt-1 font-medium animate-pulse">
                    Menyiapkan dashboard Anda...
                </p>
            </div>

            {/* Elemen Dekoratif Gelembung (Bubbles) */}
            <div className="absolute bottom-10 flex space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce"></div>
            </div>
        </div>
    );
}