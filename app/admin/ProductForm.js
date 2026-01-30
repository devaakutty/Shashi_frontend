"use client";
import { useState } from "react";

export default function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: 0,
    unit: "pcs",
    sku: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Handle Image Selection & Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const token = localStorage.getItem("token");

      // Use FormData because we are uploading a file (Multipart/form-data)
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("description", formData.description);
      dataToSend.append("price", formData.price);
      dataToSend.append("stock", formData.stock);
      dataToSend.append("unit", formData.unit);
      dataToSend.append("sku", formData.sku);
      if (imageFile) dataToSend.append("image", imageFile);

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          // Note: Browser automatically sets Content-Type to multipart/form-data when using FormData
        },
        body: dataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: "Artisan Selection Added! ✓" });
        setFormData({ name: "", description: "", price: "", stock: 0, unit: "pcs", sku: "" });
        setImageFile(null);
        setImagePreview(null);
      } else {
        setStatus({ type: "error", message: data.message || "Upload failed." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Connection error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 text-[#2c1810]">
      <div className="text-center">
        <h2 className="text-4xl font-serif italic lowercase mb-2">add selection</h2>
        <p className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-[#bc8a5f]">ShaShi Chocolate & Dessert</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        {status.message && (
          <div className={`p-4 rounded-2xl text-[10px] font-black uppercase text-center border ${
            status.type === "success" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"
          }`}>
            {status.message}
          </div>
        )}

        {/* IMAGE UPLOAD SECTION */}
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#bc8a5f]/20 rounded-[2rem] bg-[#fdf8f5] hover:border-[#bc8a5f]/50 transition-all group">
          {imagePreview ? (
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => {setImageFile(null); setImagePreview(null);}}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-[8px]"
              >✕</button>
            </div>
          ) : (
            <label className="cursor-pointer text-center">
              <div className="w-12 h-12 bg-[#2c1810] rounded-xl flex items-center justify-center text-[#bc8a5f] mx-auto mb-2 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              </div>
              <p className="text-[8px] font-black uppercase tracking-widest text-[#bc8a5f]">Upload Product Image</p>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="PRODUCT NAME" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="md:col-span-2 w-full p-4 bg-[#fdf8f5] rounded-2xl text-[11px] font-bold outline-none border border-[#bc8a5f]/10" />
          <input type="number" placeholder="PRICE (₹)" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-[#fdf8f5] rounded-2xl text-[11px] font-bold outline-none border border-[#bc8a5f]/10" />
          <input type="text" placeholder="SKU" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} className="w-full p-4 bg-[#fdf8f5] rounded-2xl text-[11px] font-bold outline-none border border-[#bc8a5f]/10" />
          <textarea placeholder="ARTISAN DESCRIPTION" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="md:col-span-2 w-full p-4 bg-[#fdf8f5] rounded-2xl text-[11px] font-bold outline-none border border-[#bc8a5f]/10 h-32" />
        </div>

        <button disabled={loading} className="w-full bg-[#bc8a5f] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[#2c1810] transition-all">
          {loading ? "Registering Selection..." : "Add to Menu"}
        </button>
      </form>
    </div>
  );
}