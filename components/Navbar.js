"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); 
  const [isOpen, setIsOpen] = useState(false);

  const isDashboardPage = pathname.startsWith("/dashboard");

  useEffect(() => {
    if (!loading && !user && isDashboardPage) {
      router.push("/login");
    }
  }, [user, loading, router, isDashboardPage]);

  if (loading || !user || !isDashboardPage) return null;

  return (
    <nav className="bg-[#fdf8f5]/70 backdrop-blur-xl border-b border-[#2c1810]/5 h-20 fixed w-full top-0 z-[100] px-6 md:px-12 flex justify-between items-center transition-all duration-500">
      
      {/* BRANDING: ShaShi Editorial Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => router.push("/dashboard")}
      >
        <div className="w-10 h-10 bg-[#2c1810] rounded-2xl flex items-center justify-center text-[#bc8a5f] shadow-lg shadow-[#2c1810]/20 transition-all duration-500 group-hover:rotate-6 group-hover:scale-105">
           <span className="font-serif italic text-xl tracking-tighter">S</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-serif italic text-[#2c1810] leading-none lowercase">
            shashi <span className="text-[#bc8a5f]">c&d</span>
          </span>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#bc8a5f] mt-1">
            Artisan Selection
          </span>
        </div>
      </div>

      {/* Desktop Menu: High-End Pill Buttons */}
      <div className="hidden md:flex items-center space-x-6">
        {/* Cart Pill */}
        <button
          className="relative flex items-center gap-3 px-6 py-2 bg-[#2c1810] text-white rounded-full font-black uppercase text-[9px] tracking-[0.2em] transition-all duration-300 hover:bg-[#bc8a5f] hover:shadow-xl hover:shadow-[#bc8a5f]/20 active:scale-95"
          onClick={() => router.push("/checkout")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#bc8a5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Cart
          {cart.length > 0 && (
            <span className="ml-1 bg-[#bc8a5f] text-[#2c1810] text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-inner">
              {cart.length}
            </span>
          )}
        </button>

        {/* Minimalist Exit Link */}
        <button
          onClick={logout}
          className="px-2 py-1.5 text-[#2c1810]/50 font-black uppercase text-[9px] tracking-[0.3em] hover:text-red-800 transition-all duration-300 relative group"
        >
          Logout
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-red-800 transition-all duration-300 group-hover:w-full"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[#2c1810] p-2 transition-transform duration-300 hover:rotate-90"
        >
          {isOpen ? (
            <span className="text-xl">✕</span>
          ) : (
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-[#2c1810]"></div>
              <div className="w-4 h-0.5 bg-[#bc8a5f]"></div>
            </div>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-6 top-20 bg-[#fdf8f5] backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-2xl border border-[#bc8a5f]/10 w-56 flex flex-col gap-3 animate-in fade-in slide-in-from-top-5 duration-500">
            <div className="pb-4 border-b border-[#2c1810]/5 mb-2">
               <p className="text-[10px] font-black uppercase tracking-widest text-[#bc8a5f] text-center">Your Selection</p>
            </div>
            <button
              className="w-full py-4 bg-[#2c1810] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#bc8a5f] transition-all"
              onClick={() => { router.push("/checkout"); setIsOpen(false); }}
            >
              Checkout ({cart.length})
            </button>
            <button
              className="w-full py-2 text-[#2c1810]/40 text-[9px] font-black uppercase tracking-widest text-center hover:text-red-800 transition-all"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
            >
              Exit Lounge
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}