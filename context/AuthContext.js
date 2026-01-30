"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../services/api"; // ✅ Use the custom axios instance we built

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user & token safely
  useEffect(() => {
    // ✅ Check if window is defined to avoid Next.js build errors
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser && savedUser !== "undefined") {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Error parsing user data");
        }
      }
      if (savedToken) setToken(savedToken);
    }

    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // ✅ No more hardcoded URLs! 
      // 'api' already knows if it's localhost or Vercel production
      const res = await api.post("/auth/login", { email, password });

      const { token: userToken, ...userData } = res.data;

      setToken(userToken);
      setUser(userData);

      localStorage.setItem("token", userToken);
      localStorage.setItem("user", JSON.stringify(userData));

      router.push("/dashboard"); // Redirect to the main lounge
      return userData;
    } catch (err) {
      // Catch Axios errors properly
      throw new Error(err.response?.data?.message || "Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading ? (
        children
      ) : (
        /* BRANDED LOADING SCREEN - LUXE STYLE */
        <div className="h-screen w-full bg-[#fdf8f5] flex items-center justify-center overflow-hidden">
          <div className="text-center animate-pulse">
            <div className="w-12 h-12 border-t-2 border-[#bc8a5f] border-solid rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-[#2c1810] font-black uppercase tracking-[0.3em] text-[10px]">
              ShaShi Chocolate & Dessert
            </h2>
            <p className="text-[#bc8a5f] text-[8px] font-bold uppercase tracking-widest mt-2 opacity-60">
              Preparing Artisan Session...
            </p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);