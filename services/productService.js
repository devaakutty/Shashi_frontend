import api from "./api";

export const getProducts = async () => {
  try {
    // baseURL in api.js is "http://localhost:5000/api"
    const res = await api.get("/products"); 
    console.log("✅ Products Loaded:", res.data.length);
    return res.data || [];
  } catch (error) {
    console.error("❌ Fetch Error:", error.response?.data?.message || error.message);
    return []; 
  }
};