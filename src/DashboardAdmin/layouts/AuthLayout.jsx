import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="bg-white/80 backdrop-blur-lg border border-white p-8 rounded-3xl shadow-2xl w-full max-w-md transition-all">
                <div className="flex flex-col items-center justify-center mb-8">
                    {/* Icon Laundry dengan Efek Glow */}
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    
                    <h1 className="text-3xl font-black tracking-tight">
                        <span className="text-blue-600">Laundry</span>
                        <span className="text-gray-800">Express</span>
                    </h1>
                    <div className="h-1 w-12 bg-blue-600 rounded-full mt-1"></div>
                </div>

                {/* Tempat halaman login/register muncul */}
                <Outlet/>

                <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                        Admin Control Panel • v2.0
                    </p>
                </div>
            </div>
        </div>
    )
}