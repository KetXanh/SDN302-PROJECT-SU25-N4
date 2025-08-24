import React, { createContext, useContext, useState, useEffect } from "react";
import authAPI from "../api/AuthAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check login status on mount (optional: use refreshToken if available)
  useEffect(() => {
    // You can implement auto-login with refreshToken here if needed
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authAPI.login(credentials);
      setUser(data.user || null);
      // Optionally save token to localStorage
      // localStorage.setItem("token", data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
      setUser(null);
      // Optionally remove token from localStorage
      // localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};