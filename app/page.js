"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import api from "../services/api"; // ✅ Use your Axios instance

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { cart } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety check: Ensure we are in the browser before touching localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        // ✅ Axios 'api' already knows your Vercel URL and adds the Token
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Auth Session Expired");
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading)
    return (
      <div className="h-screen bg-[#2c1810] flex items-center justify-center overflow-hidden">
        <div className="text-center animate-pulse">
          <div className="w-10 h-10 border-t-2 border-[#bc8a5f] border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#bc8a5f] font-serif italic tracking-widest text-[10px] uppercase">
            Opening Lounge...
          </p>
        </div>
      </div>
    );

  return (
    <main className="bg-[#fdf8f5] h-screen w-full font-serif text-[#2c1810] flex flex-col overflow-hidden relative">
      {/* Admin Portal Badge */}
      <Link
        href="/admin"
        className="fixed top-4 right-6 z-[110] flex flex-col items-center group cursor-pointer"
      >
        <div className="w-9 h-9 bg-[#2c1810] rounded-[0.8rem] flex items-center justify-center text-[#bc8a5f] shadow-2xl border border-[#bc8a5f]/20 transition-all group-hover:scale-110 group-hover:border-[#bc8a5f]/50">
          <span className="font-black text-base tracking-tighter">S</span>
        </div>
        <span className="text-[5px] font-black uppercase tracking-[0.3em] mt-1 text-[#bc8a5f] group-hover:opacity-100 opacity-60 transition-opacity">
          Admin Portal
        </span>
      </Link>

      {/* Navbar */}
      <nav className="bg-white/20 backdrop-blur-md border-b border-white/30 h-12 fixed w-full top-0 z-[100] px-6 md:px-8 flex justify-between items-center shrink-0">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <div className="w-6 h-6 bg-[#2c1810] rounded-md flex items-center justify-center text-[#bc8a5f] shadow-sm transition-transform group-hover:scale-105">
            <span className="font-black text-[10px]">S</span>
          </div>
          <span className="text-[10px] font-black text-[#2c1810] tracking-tighter uppercase">
            ShaShi <span className="text-[#bc8a5f]">Chocolate & Dessert</span>
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-3 mr-20">
          <button
            className="relative flex items-center gap-2 px-3 py-1 bg-white/40 hover:bg-[#2c1810] hover:text-white rounded-full border border-white/40 font-black uppercase text-[7px] tracking-[0.15em] transition-all"
            onClick={() => router.push("/checkout")}
          >
            Cart{" "}
            {cart.length > 0 && (
              <span className="ml-1 bg-[#bc8a5f] text-white px-1.5 rounded-full">
                {cart.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="px-2 py-1 text-[#bc8a5f] font-black uppercase text-[7px] tracking-[0.15em] hover:text-red-500 transition-colors"
          >
            Exit
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 px-6 mt-12">
        <div className="w-full max-w-5xl">
          <header className="mb-10 text-center lg:text-left">
            <h1 className="text-6xl lg:text-7xl font-black text-[#2c1810] leading-[0.85] tracking-tighter mb-4 uppercase">
              ShaShi <br />
              <span className="text-[#bc8a5f] font-serif italic font-light lowercase tracking-normal">
                Chocolate & Dessert
              </span>
            </h1>
            <p className="text-[#bc8a5f] text-[10px] font-sans font-black uppercase tracking-[0.4em] mt-2 opacity-90">
              Artisan Lounge • Control Center
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/products" className="group">
              <div className="h-64 p-10 bg-white border border-[#bc8a5f]/10 rounded-[3rem] text-[#2c1810] shadow-xl relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[#bc8a5f]/10">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-[#2c1810] rounded-2xl flex items-center justify-center mb-6 text-[#bc8a5f]">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">Menu</h2>
                  <p className="text-[#bc8a5f] text-[8px] font-sans font-black uppercase tracking-widest italic">
                    New Selection
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/reports" className="group">
              <div className="h-64 p-10 bg-[#2c1810] rounded-[3rem] text-white shadow-xl relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[#2c1810]/30">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-[#bc8a5f] rounded-2xl flex items-center justify-center mb-6 text-[#2c1810]">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 text-[#fdf8f5]">
                    Ledger
                  </h2>
                  <p className="text-[#bc8a5f] text-[8px] font-sans font-black uppercase tracking-widest italic">
                    Sales Report
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <footer className="shrink-0 py-4 text-center">
        <p className="text-[#2c1810]/30 text-[7px] font-black uppercase tracking-[0.4em]">
          ShaShi Chocolate & Dessert • Artisan Experience
        </p>
      </footer>
    </main>
  );
}