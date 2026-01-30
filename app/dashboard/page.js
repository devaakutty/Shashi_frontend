"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return (
    <div className="h-screen bg-[#2c1810] flex items-center justify-center">
      <div className="text-center animate-pulse">
        <div className="w-8 h-8 border-t-2 border-[#bc8a5f] border-solid rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#bc8a5f] font-serif italic tracking-widest text-[8px] uppercase">Opening Lounge...</p>
      </div>
    </div>
  );

  return (
    <main className="bg-[#fdf8f5] min-h-screen w-full font-serif text-[#2c1810] flex flex-col items-center justify-center p-6 relative">
      
      <div className="w-full max-w-2xl">
        {/* HEADER AREA */}
        <header className="mb-8 text-center flex flex-col items-center">
          
          {/* Container to hold Title and Admin Badge together */}
          <div className="relative inline-block px-10">
            <h1 className="text-4xl font-black text-[#2c1810] leading-none tracking-tighter uppercase">
              ShaShi <span className="text-[#bc8a5f] font-serif italic font-light lowercase tracking-normal">Chocolate</span>
            </h1>

            {/* ADMIN BADGE - Now anchored to the right of the company name */}
            <Link 
              href="/admin" 
              className="absolute -right-2 top-0 group flex flex-col items-center"
            >
              <div className="w-6 h-6 bg-[#2c1810] rounded-lg flex items-center justify-center text-[#bc8a5f] border border-[#bc8a5f]/20 transition-all group-hover:scale-110 shadow-sm">
                <span className="font-black text-[10px]">S</span>
              </div>
              <span className="text-[4px] font-black uppercase tracking-widest mt-0.5 text-[#bc8a5f] opacity-50 group-hover:opacity-100 transition-opacity">
                Admin
              </span>
            </Link>
          </div>

          <p className="text-[#bc8a5f] text-[8px] font-sans font-black uppercase tracking-[0.3em] opacity-80 mt-2">
            Artisan Lounge • Control Center
          </p>
        </header>

        {/* TWO-CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products" className="group">
            <div className="h-40 p-6 bg-white border border-[#bc8a5f]/10 rounded-[2rem] text-[#2c1810] shadow-sm relative overflow-hidden transition-all hover:shadow-md">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-[#2c1810] rounded-xl flex items-center justify-center mb-4 text-[#bc8a5f]">
                   <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                   </svg>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Menu</h2>
                <p className="text-[#bc8a5f] text-[7px] font-sans font-black uppercase tracking-widest italic">New Selection</p>
              </div>
            </div>
          </Link>

          <Link href="/reports" className="group">
            <div className="h-40 p-6 bg-[#2c1810] rounded-[2rem] text-white shadow-sm relative overflow-hidden transition-all hover:shadow-lg">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-[#bc8a5f] rounded-xl flex items-center justify-center mb-4 text-[#2c1810]">
                   <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                   </svg>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-[#fdf8f5]">Ledger</h2>
                <p className="text-[#bc8a5f] text-[7px] font-sans font-black uppercase tracking-widest italic">Sales Report</p>
              </div>
            </div>
          </Link>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-[#2c1810]/30 text-[6px] font-black uppercase tracking-[0.4em]">
            ShaShi Chocolate & Dessert • Artisan Experience
          </p>
        </footer>
      </div>
    </main>
  );
}