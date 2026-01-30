"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UserForm from "./UserForm";
import ProductForm from "./ProductForm";

export default function AdminPage() {
  const router = useRouter();
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [tab, setTab] = useState("user");
  const [adminAuth, setAdminAuth] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleAdminVerify = async (e) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);
    try {
      if (adminAuth.email === "deva0603@gmail.com" && adminAuth.password === "deva1234") {
        setIsAdminVerified(true);
      } else {
        throw new Error("Unauthorized access attempt.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isAdminVerified) {
    return (
      <main className="bg-[#fdf8f5] min-h-screen flex items-center justify-center font-serif text-[#2c1810] p-6">
        <div className="w-full max-w-md bg-white p-12 rounded-[3.5rem] shadow-2xl border border-[#bc8a5f]/10 text-center relative overflow-hidden">
          {error && <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-[10px] font-sans font-black uppercase py-3 tracking-[0.2em]">{error}</div>}
          <div className="w-20 h-20 bg-[#2c1810] rounded-[2rem] flex items-center justify-center text-[#bc8a5f] mx-auto mb-8 shadow-xl mt-4"><span className="text-4xl font-black">S</span></div>
          <h2 className="text-3xl italic lowercase mb-2 leading-none">Admin Portal</h2>
          <p className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-[#bc8a5f] mb-10 opacity-70">ShaShi Chocolate & Dessert</p>
          <form onSubmit={handleAdminVerify} className="space-y-4 text-left">
            <input type="email" placeholder="ADMIN ID" className="w-full p-4 bg-[#fdf8f5] rounded-2xl text-xs font-bold outline-none border border-[#bc8a5f]/10" onChange={(e) => setAdminAuth({...adminAuth, email: e.target.value})} required />
            <input type="password" placeholder="MASTER KEY" className="w-full p-4 bg-[#fdf8f5] rounded-2xl text-xs font-bold outline-none border border-[#bc8a5f]/10" onChange={(e) => setAdminAuth({...adminAuth, password: e.target.value})} required />
            <button className="w-full bg-[#2c1810] text-white py-5 rounded-2xl text-[10px] font-sans font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[#bc8a5f] transition-all">Access Management</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#fdf8f5] min-h-screen font-serif text-[#2c1810] p-8 pt-24 leading-relaxed">
      <div className="max-w-4xl mx-auto mb-12 flex justify-between items-center">
        <button onClick={() => router.back()} className="text-[10px] font-sans font-black uppercase tracking-widest text-[#bc8a5f] bg-white px-6 py-3 rounded-full shadow-sm">← Back</button>
        <div className="flex bg-[#2c1810]/5 p-1 rounded-2xl border border-[#bc8a5f]/10">
          <button onClick={() => setTab("user")} className={`px-8 py-2.5 rounded-xl text-[10px] font-sans font-black uppercase transition-all ${tab === 'user' ? 'bg-[#2c1810] text-white shadow-lg' : 'text-[#bc8a5f]'}`}>Register User</button>
          <button onClick={() => setTab("product")} className={`px-8 py-2.5 rounded-xl text-[10px] font-sans font-black uppercase transition-all ${tab === 'product' ? 'bg-[#2c1810] text-white shadow-lg' : 'text-[#bc8a5f]'}`}>Add Product</button>
        </div>
        <div className="w-10 h-10 bg-[#2c1810] rounded-xl flex items-center justify-center text-[#bc8a5f] shadow-lg"><span className="font-black text-lg leading-none">S</span></div>
      </div>
      <div className="max-w-xl mx-auto bg-white p-14 rounded-[4rem] shadow-2xl border border-[#bc8a5f]/5 relative overflow-hidden transition-all duration-700">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#bc8a5f]/30 to-transparent"></div>
        {tab === "user" ? <UserForm /> : <ProductForm />}
      </div>
    </main>
  );
}