"use client";
import { useState } from "react";

export default function UserForm() {
  // 1. State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // 2. State for UI feedback
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // 3. Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Submit to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      /**
       * BACKEND CHECK:
       * Your server.js uses: app.use('/api/auth', authRoutes)
       * Your controller uses: router.post("/register", registerUser)
       * Result: http://localhost:5000/api/auth/register
       */
      const response = await fetch("https://shashichoco.vercel.app/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS
        setStatus({
          type: "success",
          message: "Staff Account Registered Successfully! ✓",
        });
        setFormData({ name: "", email: "", password: "" }); // Clear form
      } else {
        // BACKEND ERROR (e.g., User already exists)
        setStatus({
          type: "error",
          message: data.message || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      // NETWORK ERROR
      console.error("Connection Error:", error);
      setStatus({
        type: "error",
        message: "Server unreachable. Ensure backend is running on port 5000.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 text-[#2c1810]">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-4xl font-serif italic lowercase mb-2">register staff</h2>
        <p className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-[#bc8a5f]">
          ShaShi Chocolate & Dessert
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        {/* Message Alert Area */}
        {status.message && (
          <div
            className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-bounce border ${
              status.type === "success"
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-red-100 text-red-700 border-red-200"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Input Fields */}
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="FULL NAME"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-4 bg-[#fdf8f5] rounded-2xl text-[11px] font-bold outline-none border border-[#bc8a5f]/10 focus:border-[#bc8a5f] transition-all"
          />
          <input
            type="email"
            name="email"
            placeholder="STAFF EMAIL"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 bg-[#fdf8f5] rounded-2xl text-[11px] font-bold outline-none border border-[#bc8a5f]/10 focus:border-[#bc8a5f] transition-all"
          />
          <input
            type="password"
            name="password"
            placeholder="ASSIGN PASSWORD"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 bg-[#fdf8f5] rounded-2xl text-[11px] font-bold outline-none border border-[#bc8a5f]/10 focus:border-[#bc8a5f] transition-all"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2c1810] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[#bc8a5f] transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Create Artisan Account"}
        </button>
      </form>
    </div>
  );
}