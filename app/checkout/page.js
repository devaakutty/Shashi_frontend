"use client";

import { useState, useMemo } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";

import CartSummary from "../../components/checkout/CartSummary";
import CustomerDetails from "../../components/checkout/CustomerDetails";
import PaymentMethod from "../../components/checkout/PaymentMethod";
import InvoiceDownload from "../../components/checkout/InvoiceDownload";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [paymentData, setPaymentData] = useState({
    method: {},
    status: "Pending",
  });

  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState([]);

  const stats = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const savings = subtotal * 0.05;
    const tax = (subtotal - savings) * 0.18;
    const grandTotal = subtotal - savings + tax;
    return { subtotal, savings, tax, grandTotal };
  }, [cart]);

  const handleConfirmPayment = () => {
    if (cart.length === 0) return alert("Cart is empty");
    if (!customerData.name) return alert("Enter customer details");
    if (paymentData.status !== "Paid") return alert("Full payment required");

    setPurchasedItems(cart);
    setPaymentConfirmed(true);
    clearCart();
  };

  return (
    // Changed h-screen to min-h-screen to prevent layout breaking
    <main className="bg-[#fdf8f5] min-h-screen w-full font-serif text-[#2c1810] flex flex-col">
      
      {/* HEADER SECTION */}
      <div className="pt-6 px-10 flex justify-between items-center shrink-0">
        <div onClick={() => router.back()} className="cursor-pointer group flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#bc8a5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          <h1 className="text-2xl font-serif italic lowercase tracking-tight">checkout</h1>
        </div>
        <p className="text-[#bc8a5f] text-[8px] font-sans font-black uppercase tracking-[0.4em]">shisha c&d artisan lounge</p>
      </div>

      <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-12 gap-8 overflow-visible">
        {!paymentConfirmed ? (
          <>
            {/* LEFT: FORMS (Scrollable) */}
            <div className="md:col-span-7 space-y-6 pb-10">
              <section className="bg-white p-8 rounded-[2.5rem] border border-[#bc8a5f]/10 shadow-sm">
                <h3 className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-[#bc8a5f] mb-6">01. customer details</h3>
                <CustomerDetails customerData={customerData} setCustomerData={setCustomerData} />
              </section>

              <section className="bg-white p-8 rounded-[2.5rem] border border-[#bc8a5f]/10 shadow-sm">
                <h3 className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-[#bc8a5f] mb-6">02. payment method</h3>
                <PaymentMethod total={stats.grandTotal} paymentData={paymentData} setPaymentData={setPaymentData} />
              </section>
            </div>

            {/* RIGHT: SELECTION SUMMARY (Fixed Position & Scrollable List) */}
            <div className="md:col-span-5 relative">
              <div className="sticky top-6 bg-[#2c1810] p-8 rounded-[3rem] text-white shadow-2xl flex flex-col max-h-[calc(100vh-100px)]">
                
                <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-[#bc8a5f] mb-4 opacity-80 shrink-0">
                  Selection Summary
                </h2>

                <h4 className="text-xl font-sans font-black uppercase tracking-tight mb-4 shrink-0">Your Selection</h4>

                {/* SCROLLABLE ITEM LIST */}
                <div className="flex-1 overflow-y-auto custom-scrollbar-white pr-2 mb-4">
                  <div className="space-y-3">
                    <CartSummary />
                  </div>
                </div>

                {/* PRICE BREAKDOWN (Fixed at bottom of card) */}
                <div className="mt-auto pt-4 border-t border-white/10 space-y-2 shrink-0">
                  <div className="flex justify-between text-[10px] font-sans font-black uppercase tracking-widest opacity-60">
                    <span>Subtotal</span>
                    <span>₹{stats.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-sans font-black uppercase tracking-widest text-emerald-400">
                    <span>Savings (5%)</span>
                    <span>-₹{stats.savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-sans font-black uppercase tracking-widest opacity-60">
                    <span>Tax (18% GST)</span>
                    <span>₹{stats.tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-end pt-4 pb-2">
                    <span className="text-xs font-sans font-black uppercase tracking-[0.2em]">Grand Total</span>
                    <span className="text-4xl font-sans font-black italic">₹{stats.grandTotal.toFixed(2)}</span>
                  </div>

                  {/* THE BUTTON (Now Guaranteed Visible) */}
                  <button
                    onClick={handleConfirmPayment}
                    className="w-full bg-[#bc8a5f] text-white font-sans font-black py-5 rounded-[1.8rem] hover:bg-white hover:text-[#2c1810] transition-all flex items-center justify-center gap-3 uppercase text-[11px] tracking-[0.2em] shadow-lg"
                  >
                    Complete Order
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                       <span className="text-sm">→</span>
                    </div>
                  </button>
                </div>

              </div>
            </div>
          </>
        ) : (
          <div className="col-span-12 flex justify-center items-center py-10">
            <InvoiceDownload cart={purchasedItems} customerData={customerData} paymentData={paymentData} />
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar-white::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-white::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-white::-webkit-scrollbar-thumb { 
          background: rgba(188, 138, 95, 0.4); 
          border-radius: 10px; 
        }
      `}</style>
    </main>
  );
}