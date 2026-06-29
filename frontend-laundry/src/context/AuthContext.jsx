import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  loginRequest,
  logoutRequest,
  getStoredSession,
  AUTH_STORAGE_KEY,
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(getStoredSession());
    setReady(true);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const { user: session } = await loginRequest(username, password);
      setUser(session);
      return { ok: true, redirect: session.redirect };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || err.message || "Login gagal.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutRequest();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, ready, loading, login, logout, isAuthenticated: !!user }),
    [user, ready, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { AUTH_STORAGE_KEY };
