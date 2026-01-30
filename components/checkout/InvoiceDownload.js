"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";

export default function InvoiceDownload({ cart = [], customerData = {}, paymentData = {} }) {
  const router = useRouter();
  const GST_RATE = 0.18; 
  const DISCOUNT_RATE = 0.05; 
  const invoiceRef = useRef(null);

  // --- CORE CALCULATIONS ---
  const subtotal = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const discountAmount = subtotal * DISCOUNT_RATE;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = taxableAmount * GST_RATE;
  const grandTotal = taxableAmount + gstAmount;
  
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

  const saveToDailyReport = () => {
    try {
      const transaction = {
        invoiceNumber,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        customer: {
          name: customerData.name || "Walk-in",
          phone: customerData.phone || "N/A"
        },
        items: cart.map(item => ({
          name: item.name,
          qty: item.quantity || 1,
          unitPrice: item.price,
          total: (item.price * (item.quantity || 1)).toFixed(2)
        })),
        finance: {
          subtotal: subtotal.toFixed(2),
          discount: discountAmount.toFixed(2),
          gst: gstAmount.toFixed(2),
          grandTotal: grandTotal.toFixed(2)
        },
        payment: {
          methods: paymentData.method, 
          status: paymentData.status
        }
      };

      const rawData = localStorage.getItem("daily_reports");
      const existingReports = rawData ? JSON.parse(rawData) : [];
      existingReports.push(transaction);
      localStorage.setItem("daily_reports", JSON.stringify(existingReports));
      
      return true;
    } catch (e) {
      console.error("Storage Error:", e);
      return false;
    }
  };

  const handlePrintAndFinish = () => {
    if (!saveToDailyReport()) return alert("Error saving report!");

    const content = invoiceRef.current.innerHTML;
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.visibility = 'hidden';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow.document;
    doc.write(`
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: 58mm auto; margin: 0; }
            body { font-family: 'Courier New', monospace; width: 48mm; padding: 2mm; color: black; }
            .dashed { border-top: 1px dashed black; margin: 5px 0; }
          </style>
        </head>
        <body class="text-[10px] leading-tight">
          ${content}
          <div class="dashed"></div>
          <div style="text-align:center; font-size: 8px; margin-top: 5px; font-weight: bold;">
              SHISHA C&D ARTISAN LOUNGE
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.parent.postMessage('finished', '*');
              };
            };
          </script>
        </body>
      </html>
    `);
    doc.close();

    window.addEventListener('message', (event) => {
      if (event.data === 'finished') {
        document.body.removeChild(printFrame);
        router.push("/products"); 
      }
    }, { once: true });
  };

  return (
    <section className="bg-white p-8 rounded-[3rem] shadow-2xl border border-[#bc8a5f]/10 max-w-sm mx-auto font-serif text-[#2c1810]">
      {/* Header Notification */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#bc8a5f]/10 text-[#bc8a5f] rounded-full flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <h2 className="text-xl italic lowercase tracking-tight">Order Confirmed</h2>
        <p className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-[#bc8a5f] mt-1">Receipt is ready</p>
      </div>

      <div className="bg-[#fdf8f5] p-5 rounded-[2.5rem] mb-8 border-2 border-dashed border-[#bc8a5f]/20">
        <div ref={invoiceRef} className="bg-white p-3 text-black w-full font-mono text-[10px] leading-relaxed">
          {/* Header */}
          <div className="text-center font-bold mb-2 uppercase">
            <h2 className="text-sm font-serif italic lowercase tracking-tight">shisha c&d</h2>
            <p className="text-[7px] tracking-widest font-sans uppercase">artisan lounge</p>
            <p className="text-[6px] opacity-70 mt-1">{new Date().toLocaleDateString()} — {new Date().toLocaleTimeString()}</p>
          </div>
          <div className="border-t border-dashed border-black/20 my-2"></div>
          
          {/* Customer */}
          <div className="space-y-0.5 text-[9px] mb-2 font-sans">
            <p>INV: <span className="font-bold">{invoiceNumber}</span></p>
            <p>GUEST: <span className="font-bold uppercase">{customerData.name || "WALK-IN"}</span></p>
            {customerData.phone && <p>TEL : <span className="font-bold">{customerData.phone}</span></p>}
          </div>
          <div className="border-t border-dashed border-black/20 my-2"></div>

          {/* Item List */}
          <div className="space-y-1.5 mb-2 font-sans">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between items-start">
                <span className="uppercase text-[8px] max-w-[70%] leading-tight">{item.name} <span className="opacity-60">x{item.quantity}</span></span>
                <span className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-black/20 my-2"></div>

          {/* Totals Section */}
          <div className="space-y-1 text-[9px] font-sans">
            <div className="flex justify-between text-gray-500 italic">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#bc8a5f] italic">
              <span>Savings (5%)</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 italic">
              <span>Tax (18%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-black text-sm pt-2 border-t border-black mt-1">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-black/20 my-2"></div>

          {/* Payment */}
          <div className="text-[9px] font-sans">
            <p className="font-black uppercase text-[7px] tracking-widest text-[#bc8a5f] mb-1">Transaction</p>
            {Object.entries(paymentData.method || {}).map(([key, val]) => (
              <div key={key} className="flex justify-between opacity-80">
                <span className="uppercase">{key}</span>
                <span>₹{typeof val === 'object' ? val.amount : val}</span>
              </div>
            ))}
            <p className="mt-2 font-black text-center text-[8px] border border-black p-1 rounded">STATUS: {paymentData.status}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handlePrintAndFinish}
        className="w-full bg-[#2c1810] text-white font-sans font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:bg-[#bc8a5f] transition-all active:scale-95 uppercase text-[10px] tracking-[0.3em]"
      >
        <span>Print Receipt</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      </button>
    </section>
  );
}