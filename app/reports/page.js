"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DailyReportPage() {
  const router = useRouter();
  const [allReports, setAllReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  // Helper function to format names (Upper/Lower case balance)
  const formatName = (name) => {
    if (!name) return "Walk-In";
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("daily_reports") || "[]");
      const sortedData = Array.isArray(data) ? data.reverse() : [];
      setAllReports(sortedData);
      setFilteredReports(sortedData);
    } catch (e) {
      console.error("Error loading reports", e);
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    let filtered = [...allReports];

    if (activeFilter === "today") {
      filtered = allReports.filter((r) => {
        const reportDate = new Date(r.timestamp);
        return reportDate.toDateString() === now.toDateString();
      });
    } else if (activeFilter === "week") {
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      filtered = allReports.filter((r) => new Date(r.timestamp) >= lastWeek);
    } else if (activeFilter === "month") {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      filtered = allReports.filter((r) => new Date(r.timestamp) >= lastMonth);
    }

    setFilteredReports(filtered);
  }, [activeFilter, allReports]);

  const totalSales = filteredReports.reduce((acc, curr) => 
    acc + parseFloat(curr?.finance?.grandTotal || 0), 0
  );
  
  const totalGST = filteredReports.reduce((acc, curr) => 
    acc + parseFloat(curr?.finance?.gst || 0), 0
  );

  return (
    <div className="bg-[#fdf8f5] min-h-screen font-serif text-[#2c1810]">
      {/* HEADER NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/40 backdrop-blur-md z-50 px-8 flex items-center justify-between border-b border-[#bc8a5f]/10">
        <div 
          onClick={() => router.back()} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-[#2c1810] rounded-xl flex items-center justify-center text-[#bc8a5f] shadow-md">
             <span className="font-black text-sm">S</span>
          </div>
          <span className="text-lg font-serif italic lowercase tracking-tighter">
            shisha <span className="text-[#bc8a5f]">sales</span> report
          </span>
        </div>
        
        <div className="hidden md:flex bg-[#2c1810]/5 p-1 rounded-full border border-[#bc8a5f]/10">
          {["all", "today", "week", "month"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[9px] font-sans font-black uppercase tracking-widest transition-all ${
                activeFilter === f 
                ? "bg-[#2c1810] text-white shadow-md" 
                : "text-[#bc8a5f] hover:bg-white/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button 
          onClick={() => router.push("/products")}
          className="bg-[#2c1810] text-white px-5 py-2 rounded-full text-[9px] font-sans font-black uppercase tracking-widest hover:bg-[#bc8a5f] transition-all shadow-lg"
        >
          New Sale
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-8 pt-24 pb-20">
        <header className="mb-10">
          <h1 className="text-4xl font-serif italic text-[#2c1810] lowercase leading-tight">
            shisha <span className="text-[#bc8a5f]">sales</span> report
          </h1>
          <p className="text-[#bc8a5f] text-[10px] font-sans font-black uppercase tracking-[0.4em] mt-1 opacity-70">
            monitoring artisan lounge growth
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#2c1810] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <p className="text-[9px] font-sans font-black opacity-50 uppercase tracking-[0.3em] mb-2 text-[#bc8a5f]">Total Revenue</p>
            <p className="text-3xl font-serif italic tracking-tighter">₹{totalSales.toLocaleString('en-IN')}</p>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#bc8a5f]/10 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-[#bc8a5f]/10 shadow-sm">
            <p className="text-[9px] font-sans font-black text-[#bc8a5f] uppercase tracking-[0.3em] mb-2">GST Collected</p>
            <p className="text-2xl font-serif italic text-[#2c1810]">₹{totalGST.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-[#f5e6de] p-8 rounded-[2.5rem] shadow-sm border border-white">
            <p className="text-[9px] font-sans font-black text-[#2c1810] uppercase tracking-[0.3em] mb-2">Total Orders</p>
            <p className="text-2xl font-serif italic text-[#2c1810]">{filteredReports.length}</p>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-lg rounded-[2.5rem] shadow-sm border border-white p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[#bc8a5f] text-[9px] font-sans font-black uppercase tracking-[0.2em]">
                  <th className="px-6 pb-2">date</th>
                  <th className="px-6 pb-2">invoice</th>
                  <th className="px-6 pb-2">guest</th>
                  <th className="px-6 pb-2 text-right">total</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, idx) => (
                  <tr key={idx} className="bg-white hover:bg-[#fdf8f5] transition-all rounded-2xl shadow-sm group">
                    <td className="px-6 py-5 rounded-l-2xl">
                      <p className="text-xs font-black text-[#2c1810]">{report?.date}</p>
                      <p className="text-[9px] text-[#bc8a5f] font-mono">{report?.time}</p>
                    </td>
                    <td className="px-6 py-5 font-mono text-[10px] font-bold text-[#bc8a5f]">
                      {report?.invoiceNumber}
                    </td>
                    <td className="px-6 py-5">
                      {/* Mixed Case: Upper first, Lower rest */}
                      <p className="text-xs font-black text-[#2c1810]">
                        {formatName(report?.customer?.name)}
                      </p>
                      <p className="text-[9px] text-[#bc8a5f] font-sans tracking-widest">{report?.customer?.phone || "N/A"}</p>
                    </td>
                    <td className="px-6 py-5 rounded-r-2xl text-right">
                      <span className="text-lg font-serif italic text-[#2c1810]">
                        ₹{parseFloat(report?.finance?.grandTotal || 0).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredReports.length === 0 && (
            <div className="p-20 text-center text-[#bc8a5f] italic font-serif text-sm">
              the sales report ledger is currently empty.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}