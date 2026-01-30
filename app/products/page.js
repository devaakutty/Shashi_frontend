"use client";
import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../services/productService";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state for better UX
  const router = useRouter();

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Cloud Fetch Error:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="bg-[#fdf8f5] h-screen w-full font-serif text-[#2c1810] flex flex-col overflow-hidden">
      
      {/* HEADER NAVBAR - Cocoa & Gold Style */}
      <nav className="h-20 bg-white/40 backdrop-blur-md px-8 flex items-center justify-between border-b border-[#bc8a5f]/10 shrink-0 z-50">
        <div 
          onClick={() => router.push("/dashboard")} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-[#2c1810] rounded-2xl flex items-center justify-center text-[#bc8a5f] shadow-lg transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
            <span className="font-serif italic text-xl">S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-serif italic font-light tracking-tighter leading-none lowercase">
              shisha <span className="text-[#bc8a5f]">c&d</span>
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#bc8a5f] mt-0.5">
              Artisan Lounge
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/checkout")}
              className="bg-[#2c1810] text-white px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl hover:bg-[#bc8a5f] hover:shadow-[#bc8a5f]/20 transition-all active:scale-95"
            >
              View Selection ({products.length > 0 ? products.length : 0})
            </button>
        </div>
      </nav>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-hidden flex flex-col px-8 pt-8">
        <header className="mb-8 shrink-0">
          <h1 className="text-5xl font-serif italic lowercase tracking-tight mb-2">
            artisan <span className="text-[#bc8a5f]">menu</span>
          </h1>
          <p className="text-[#bc8a5f] text-[10px] font-black uppercase tracking-[0.4em] opacity-70">
            Chocolates & Premium Artisan Selections
          </p>
        </header>

        {/* SCROLLABLE GRID CONTAINER - Strictly 4 Columns on Large Screens */}
        <div className="flex-1 overflow-y-auto pr-2 mb-8 custom-scrollbar">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
                <p className="text-[#bc8a5f] font-serif italic text-xl opacity-30 animate-pulse">
                   preparing the lounge...
                </p>
            </div>
          ) : products.length > 0 ? (
            /* ✅ GRID FIX: Using lg:grid-cols-4 and xl:grid-cols-4 for consistency */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10 max-w-[1600px] mx-auto">
              {products.map((product) => (
                <div key={product._id} className="h-full flex justify-center">
                   <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-4">
                <p className="text-[#bc8a5f] font-serif italic text-xl opacity-40">
                   Your selection is currently empty.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-[10px] font-black uppercase tracking-widest text-[#2c1810] border-b border-[#2c1810] pb-1"
                >
                  Refresh Menu
                </button>
            </div>
          )}
        </div>
      </div>

      {/* CUSTOM SCROLLBAR CSS */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
            background: #f5e6de; 
            border-radius: 20px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #bc8a5f; }
      `}</style>
    </main>
  );
}