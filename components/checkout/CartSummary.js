"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";

export default function CartSummary() {
  const { cart = [], updateCartItem, removeFromCart } = useCart();
  const [localCart, setLocalCart] = useState([]);

  const TAX_RATE = 0.18;
  const DISCOUNT_RATE = 0.05;

  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  const handleQuantityChange = (id, delta) => {
    const item = localCart.find(i => (i._id || i.id) === id);
    if (!item) return;
    const newQty = (item.quantity || 1) + delta;
    if (newQty < 1) return;
    updateCartItem?.(id, newQty);
  };

  const subtotal = localCart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  const discount = subtotal * DISCOUNT_RATE;
  const tax = (subtotal - discount) * TAX_RATE; 
  const total = subtotal - discount + tax;

  return (
    <section className="text-white font-sans h-full flex flex-col py-1">
      {/* 1. TIGHTER HEADER */}
      <h2 className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-[#bc8a5f] mb-4 opacity-90 border-b border-white/10 pb-2">
        Summary
      </h2>

      {localCart.length === 0 ? (
        <div className="flex-1 flex items-center justify-center opacity-30 py-10">
           <p className="text-[10px] font-black uppercase tracking-widest italic">Empty Cart</p>
        </div>
      ) : (
        <>
          {/* 2. COMPACT ITEM LIST */}
          <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar-white">
            {localCart.map((item, index) => (
              <div
                key={item._id || item.id || index}
                className="bg-white/5 p-3 rounded-xl border border-white/5 group transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/90 truncate mr-2">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-bold text-[#bc8a5f] font-mono whitespace-nowrap">
                    ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10">
                    <button
                      className="w-5 h-5 flex items-center justify-center hover:text-[#bc8a5f] transition-all"
                      onClick={() => handleQuantityChange(item._id || item.id, -1)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                    </button>
                    <span className="text-[9px] font-black px-2 min-w-[25px] text-center">{item.quantity || 1}</span>
                    <button
                      className="w-5 h-5 flex items-center justify-center hover:text-[#bc8a5f] transition-all"
                      onClick={() => handleQuantityChange(item._id || item.id, 1)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>

                  <button
                    className="text-[8px] font-black uppercase tracking-tighter text-red-400/30 hover:text-red-400 transition-all"
                    onClick={() => removeFromCart?.(item._id || item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 3. TIGHT FINANCIAL SUMMARY */}
          <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 shrink-0">
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest opacity-50">
              <span>Subtotal</span>
              <span className="font-mono">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-emerald-400/80">
              <span>Savings</span>
              <span className="font-mono">-₹{discount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-end pt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#bc8a5f]">Total</span>
              <span className="text-2xl font-black italic tracking-tighter leading-none">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .custom-scrollbar-white::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar-white::-webkit-scrollbar-thumb { 
          background: rgba(188, 138, 95, 0.3); 
          border-radius: 10px; 
        }
      `}</style>
    </section>
  );
}