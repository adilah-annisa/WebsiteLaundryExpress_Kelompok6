import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataForm, setDataForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({
            ...dataForm,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let username = dataForm.email;
            let password = dataForm.password;

            if (dataForm.email === "laundryexpress" && dataForm.password === "laundry123") {
                username = "emilys";
                password = "emilyspass";
            }

            const response = await axios.post("https://dummyjson.com/user/login", {
                username,
                password,
            });

            if (response.status !== 200) {
                setError(response.data.message || "Login gagal. Coba lagi.");
                return;
            }

            navigate("/");
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "Login gagal. Periksa username dan password.");
            } else {
                setError(err.message || "Terjadi kesalahan. Coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

    const errorInfo = error ? (
        <div className="bg-red-100 mb-5 p-4 text-sm text-red-700 rounded-lg flex items-center gap-2">
            <BsFillExclamationDiamondFill className="text-red-600 text-lg" />
            <span>{error}</span>
        </div>
    ) : null;

    const loadingInfo = loading ? (
        <div className="bg-blue-50 mb-5 p-4 text-sm text-blue-700 rounded-lg flex items-center gap-2">
            <ImSpinner2 className="animate-spin text-blue-600" />
            <span>Mohon tunggu...</span>
        </div>
    ) : null;

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
                <p className="text-gray-500 text-sm">Silakan masuk dengan akun Laundry Express.</p>
            </div>

            {errorInfo}
            {loadingInfo}

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="text-sm font-bold text-gray-700 ml-1">Username</label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        value={dataForm.email}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-0 transition-all outline-none"
                        placeholder="laundryexpress"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="text-sm font-bold text-gray-700 ml-1">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={dataForm.password}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-0 transition-all outline-none"
                        placeholder="••••••••"
                    />
                </div>

                <div className="text-right text-xs">
                    <Link to="/forgot" className="text-blue-600 font-semibold hover:underline">Lupa Password?</Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-300 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    Masuk Sekarang
                </button>
            </form>

            <p className="text-center text-sm text-gray-500">
                Belum punya akun? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Daftar sekarang</Link>
            </p>
        </div>
    );
}
