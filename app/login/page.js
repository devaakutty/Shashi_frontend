"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext"; // your existing AuthContext

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper to catch common typos like "gamil.com"
  const checkTypos = (input) => {
    const domain = input.split("@")[1];
    if (domain === "gamil.com") return "Did you mean gmail.com?";
    if (input.length > 0 && !input.includes("@")) return "Please enter a valid email address.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Validate email
    const typoError = checkTypos(email);
    if (typoError) {
      setError(typoError);
      return;
    }

    setLoading(true);
    try {
      // 2. Call your AuthContext login function
      const user = await login(email, password); 

      // 3. Redirect on success
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#fdf8f5] font-serif text-[#2c1810] overflow-hidden px-6">

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#bc8a5f]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2c1810]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-700">

        {/* Branding */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#2c1810] rounded-[2.2rem] flex items-center justify-center text-[#bc8a5f] mx-auto mb-8 shadow-2xl transform hover:scale-105 transition-all duration-500 border border-[#bc8a5f]/20">
            <span className="text-4xl font-black tracking-tighter">S</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-[#2c1810] leading-none mb-3">
            SHASHI <span className="text-[#bc8a5f] italic font-serif">C&D</span>
          </h1>
          <p className="text-[#bc8a5f] text-[10px] font-sans font-black uppercase tracking-[0.5em] opacity-90">
            Artisan Lounge
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] shadow-[0_32px_64px_-15px_rgba(44,24,16,0.15)] border border-white"
        >
          <div className="space-y-5 font-sans">

            {/* Email */}
            <div className="relative">
              <label className="text-[9px] font-black uppercase tracking-widest text-[#bc8a5f] ml-5 mb-2 block">Staff Email</label>
              <input
                type="email"
                placeholder="artisan@lounge.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                className="w-full p-4 bg-[#fdf8f5] border border-[#bc8a5f]/10 rounded-2xl text-[12px] font-bold outline-none focus:border-[#bc8a5f]/40 transition-all text-[#2c1810] placeholder:opacity-30"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-[9px] font-black uppercase tracking-widest text-[#bc8a5f] ml-5 mb-2 block">Secure Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-[#fdf8f5] border border-[#bc8a5f]/10 rounded-2xl text-[12px] font-bold outline-none focus:border-[#bc8a5f]/40 transition-all text-[#2c1810] placeholder:opacity-30"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-xl animate-shake">
                <p className="text-red-600 text-[10px] font-black uppercase tracking-tight text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2c1810] text-white py-5 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-[#bc8a5f] transition-all active:scale-95 mt-4 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Enter Lounge"}
            </button>

          </div>
        </form>

        <div className="text-center mt-12 opacity-30">
          <p className="text-[#bc8a5f] text-[8px] font-sans font-black uppercase tracking-[0.6em]">
            QuickBillz Artisan Pro
          </p>
        </div>

      </div>
    </div>
  );
}
