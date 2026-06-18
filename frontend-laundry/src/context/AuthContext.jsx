import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AUTH_STORAGE_KEY, AUTH_USERS } from "../lib/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  const login = (username, password) => {
    const normalized = String(username).trim().toLowerCase();
    const found = Object.values(AUTH_USERS).find(
      (u) => u.username === normalized && u.password === password
    );

    if (!found) {
      return { ok: false, message: "Username atau password salah." };
    }

    const session = {
      username: found.username,
      role: found.role,
      name: found.name,
      customerId: found.customerId || null,
      redirect: found.redirect,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true, redirect: found.redirect };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, ready, login, logout, isAuthenticated: !!user }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
