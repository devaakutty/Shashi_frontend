"use client";

import React, { useState, useEffect } from "react";

export default function PaymentMethod({ setPaymentData, total = 0 }) {
  const TAX_RATE = 0.18;
  const DISCOUNT_RATE = 0.05;

  const subtotal = total; 
  const discountAmount = subtotal * DISCOUNT_RATE;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * TAX_RATE;
  const finalPayable = taxableAmount + taxAmount;

  const [activeMethods, setActiveMethods] = useState([]);
  const [amounts, setAmounts] = useState({ Cash: 0, UPI: 0, Card: 0 });
  const [upiProvider, setUpiProvider] = useState("");
  const [upiConfirmed, setUpiConfirmed] = useState(false);
  const [cashConfirmed, setCashConfirmed] = useState(false);
  const [cardInfo, setCardInfo] = useState({ number: "", expiry: "", cvv: "" });

  // Handle manual amount changes
  const handleAmountChange = (method, val) => {
    const num = Math.max(0, Number(val) || 0);
    const clampedNum = num > finalPayable ? finalPayable : num;

    setAmounts((prev) => {
      const newAmounts = { ...prev, [method]: clampedNum };
      if (activeMethods.includes("Cash") && activeMethods.includes("UPI")) {
        const otherMethod = method === "Cash" ? "UPI" : "Cash";
        newAmounts[otherMethod] = Math.max(0, Number((finalPayable - clampedNum).toFixed(2)));
      }
      return newAmounts;
    });
    
    if (method === "UPI") setUpiConfirmed(false);
    if (method === "Cash") setCashConfirmed(false);
  };

  const toggleMethod = (method) => {
    setActiveMethods((prev) => {
      let nextActive;
      if (prev.includes(method)) {
        nextActive = prev.filter((m) => m !== method);
        setAmounts((a) => ({ ...a, [method]: 0 }));
      } else {
        if (method === "Card") {
          nextActive = ["Card"];
          setAmounts({ Cash: 0, UPI: 0, Card: finalPayable });
        } else {
          nextActive = prev.filter((m) => m !== "Card");
          const currentAllocated = Object.entries(amounts)
            .filter(([k]) => nextActive.includes(k))
            .reduce((sum, [_, v]) => sum + v, 0);

          nextActive.push(method);
          setAmounts((a) => ({ 
            ...a, 
            Card: 0, 
            [method]: Math.max(0, Number((finalPayable - currentAllocated).toFixed(2))) 
          }));
        }
      }
      return nextActive;
    });
  };

  useEffect(() => {
    const totalPaid = Number((amounts.Cash + amounts.Card + amounts.UPI).toFixed(2));
    const isUpiValid = !activeMethods.includes("UPI") || (upiConfirmed && upiProvider);
    const isCashValid = !activeMethods.includes("Cash") || (cashConfirmed && amounts.Cash > 0);
    const isCardValid = !activeMethods.includes("Card") || (cardInfo.number.length >= 10);
    
    const balanceCleared = Math.abs(totalPaid - finalPayable) < 0.1;

    setPaymentData({
      calculations: { subtotal, discount: discountAmount, tax: taxAmount, finalPayable },
      method: activeMethods.reduce((obj, m) => {
        if (m === "UPI") obj.UPI = { amount: amounts.UPI, provider: upiProvider, confirmed: upiConfirmed };
        else if (m === "Card") obj.Card = { amount: amounts.Card, ...cardInfo };
        else obj[m] = { amount: amounts[m], confirmed: cashConfirmed };
        return obj;
      }, {}),
      totalPaid,
      status: balanceCleared && isUpiValid && isCashValid && isCardValid ? "Paid" : "Pending",
    });
  }, [activeMethods, amounts, upiProvider, upiConfirmed, cashConfirmed, cardInfo, finalPayable, setPaymentData]);

  return (
    <div className="bg-transparent space-y-6 font-sans">
      {/* BILLING SUMMARY */}
      <div className="p-6 bg-[#fdf8f5] rounded-[2.5rem] border border-[#bc8a5f]/10 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black text-[#bc8a5f] uppercase tracking-[0.3em]">Billing Summary</h3>
          <span className="text-2xl font-black text-[#2c1810] italic">₹{finalPayable.toFixed(2)}</span>
        </div>
      </div>

      {/* PAYMENT METHODS */}
      <div className="space-y-4">
        {["Cash", "UPI", "Card"].map((method) => {
          const isActive = activeMethods.includes(method);
          return (
            <div key={method} className={`rounded-[2rem] p-5 transition-all duration-500 border ${isActive ? "border-[#bc8a5f] bg-white shadow-xl" : "border-[#bc8a5f]/5 bg-white opacity-60"}`}>
              <div className="flex justify-between items-center">
                <button type="button" onClick={() => toggleMethod(method)} className="font-black uppercase tracking-[0.2em] flex items-center gap-4 text-[11px] text-[#2c1810]">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isActive ? "bg-[#bc8a5f] border-[#bc8a5f]" : "border-[#bc8a5f]/20"}`}>
                    {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  {method}
                </button>

                {isActive && (
                  <div className="flex items-center bg-[#fdf8f5] rounded-xl px-4 py-2 border border-[#bc8a5f]/10">
                    <span className="text-[#bc8a5f] font-black mr-2">₹</span>
                    <input
                      type="number"
                      value={amounts[method] === 0 ? "" : amounts[method]}
                      onChange={(e) => handleAmountChange(method, e.target.value)}
                      className="w-20 text-right outline-none font-black text-[#2c1810] bg-transparent"
                    />
                  </div>
                )}
              </div>

              {/* UPI QR Section */}
              {method === "UPI" && isActive && (
                <div className="mt-4 pt-4 border-t border-[#bc8a5f]/10">
                  <div className="flex gap-2 mb-4">
                    {["GPay", "PhonePe", "Paytm"].map((p) => (
                      <button key={p} onClick={() => {setUpiProvider(p); setUpiConfirmed(false);}} className={`flex-1 py-2 rounded-xl text-[9px] font-black border transition-all ${upiProvider === p ? "bg-[#2c1810] text-white" : "border-[#bc8a5f]/20 text-[#bc8a5f]"}`}>{p}</button>
                    ))}
                  </div>
                  {upiProvider && (
                    <div className="text-center p-4 bg-[#fdf8f5] rounded-3xl border border-[#bc8a5f]/10">
                      {/* Dynamic Amount Text */}
                      <p className="text-[10px] font-black text-[#bc8a5f] mb-4 uppercase tracking-[0.2em]">
                        Scan to pay <span className="text-[#2c1810] text-xs">₹{amounts.UPI.toFixed(2)}</span>
                      </p>
                      
                      {/* QR Container with Amount Overlay */}
                      <div className="relative w-40 h-40 mx-auto mb-4 bg-white p-2 rounded-2xl shadow-inner border border-[#bc8a5f]/10 flex items-center justify-center">
                         <img src="/qr/my-upi-qr.png" alt="UPI QR" className="w-full h-full object-contain" />
                         {/* This overlay makes it clear how much is being paid */}
                         <div className="absolute -bottom-2 bg-[#2c1810] text-white text-[8px] px-3 py-1 rounded-full font-black">
                           PAY ₹{amounts.UPI}
                         </div>
                      </div>

                      {!upiConfirmed ? (
                        <button onClick={() => setUpiConfirmed(true)} className="w-full bg-[#bc8a5f] text-white py-3 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-[#bc8a5f]/20 active:scale-95 transition-transform">Confirm Payment Received</button>
                      ) : (
                        <div className="py-3 bg-[#2c1810] text-[#bc8a5f] font-black rounded-xl text-[10px] uppercase animate-pulse">✓ UPI Success</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Cash & Card Sections remain the same as your code */}
              {method === "Cash" && isActive && (
                <div className="mt-4 pt-4 border-t border-[#bc8a5f]/10">
                  {!cashConfirmed ? (
                    <button onClick={() => setCashConfirmed(true)} className="w-full bg-[#bc8a5f] text-white py-3 rounded-2xl text-[10px] font-black uppercase">Verify Cash Received</button>
                  ) : (
                    <div className="py-3 bg-[#2c1810] text-[#bc8a5f] font-black rounded-2xl text-[10px] uppercase text-center">✓ Cash Confirmed</div>
                  )}
                </div>
              )}

              {method === "Card" && isActive && (
                <div className="mt-4 space-y-4 pt-4 border-t border-[#bc8a5f]/10">
                  <input type="text" placeholder="CARD NUMBER" className="w-full bg-[#fdf8f5] border border-[#bc8a5f]/10 rounded-2xl p-4 text-[11px] font-black outline-none" onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })} />
                  <div className="flex gap-4">
                    <input type="text" placeholder="MM/YY" className="flex-1 bg-[#fdf8f5] border border-[#bc8a5f]/10 rounded-2xl p-4 text-[11px] font-black outline-none" onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })} />
                    <input type="password" placeholder="CVV" className="flex-1 bg-[#fdf8f5] border border-[#bc8a5f]/10 rounded-2xl p-4 text-[11px] font-black outline-none" onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* BALANCE INDICATOR */}
      <div className={`mt-8 p-6 rounded-[2rem] transition-all duration-500 ${(amounts.Cash + amounts.UPI + amounts.Card).toFixed(2) >= finalPayable.toFixed(2) ? "bg-[#2c1810]" : "bg-[#fdf8f5] border border-[#bc8a5f]/10"}`}>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#bc8a5f]">Payment Status</span>
          <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${ (amounts.Cash + amounts.UPI + amounts.Card).toFixed(2) >= finalPayable.toFixed(2) ? "text-white" : "text-[#2c1810]" }`}>
              {(amounts.Cash + amounts.UPI + amounts.Card).toFixed(2) >= finalPayable.toFixed(2) ? "Fully Paid ✓" : `Deficit: ₹${(finalPayable - (amounts.Cash + amounts.UPI + amounts.Card)).toFixed(2)}`}
          </span>
        </div>
      </div>
    </div>
  );
}