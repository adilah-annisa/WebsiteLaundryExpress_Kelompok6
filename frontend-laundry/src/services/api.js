import axios from "axios";
import users from "../data/Users.json";

export const TOKEN_KEY = "laundry_express_token";
export const AUTH_STORAGE_KEY = "laundry_express_auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    return Promise.reject(error);
  }
);

const ROLE_REDIRECT = {
  admin: "/dashboard",
  pelanggan: "/pelanggan",
  kurir: "/kurir",
};

export async function loginRequest(username, password) {
  await new Promise((r) => setTimeout(r, 600));

  const normalized = String(username).trim().toLowerCase();
  const found = users.find(
    (u) => u.username === normalized && u.password === password
  );

  if (!found) {
    const err = new Error("Username atau password salah.");
    err.response = { data: { message: err.message }, status: 401 };
    throw err;
  }

  const token = btoa(`${found.username}:${Date.now()}`);
  const session = {
    username: found.username,
    role: found.role,
    name: found.name,
    customerId: found.customerId || null,
    email: found.email,
    redirect: ROLE_REDIRECT[found.role],
  };

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

  return { token, user: session };
}

export function logoutRequest() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default api;
