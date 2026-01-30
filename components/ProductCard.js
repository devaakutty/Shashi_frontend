"use client";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const inCart = cart.some((item) => item._id === product._id);

  const displayImage = product.image?.url || "/placeholder-chocolate.jpg";

  return (
    // Reduced padding from p-3 to p-2 and max-width to keep it compact
    <div className="bg-[#fdf8f5] p-2 rounded-[2rem] shadow-sm border border-[#2c1810]/5 flex flex-col justify-between transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden h-full max-w-[240px] mx-auto">
      
      {/* Subtle Glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#bc8a5f]/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Compact Image - Aspect ratio kept at 4/5 */}
        <div className="overflow-hidden rounded-[1.8rem] mb-3 aspect-[4/5] relative shadow-md bg-[#2c1810]">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90"
            onError={(e) => { e.target.src = "https://via.placeholder.com/400x500?text=ShaShi"; }}
          />
          
          {/* Compact Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#2c1810]/90 to-transparent">
            <h3 className="text-base font-serif italic text-white lowercase leading-tight tracking-wide truncate">
              {product.name}
            </h3>
            <div className="flex justify-between items-end mt-1">
              <div className="text-left">
                <p className="text-white font-sans font-bold text-xs">
                  ₹{product.price?.toLocaleString('en-IN')}
                </p>
                <p className="text-[#bc8a5f] text-[6px] font-black uppercase tracking-widest">
                  {product.unit || "6 PCS"}
                </p>
              </div>
              
              {!inCart && (
                <button
                  onClick={() => addToCart(product)}
                  className="w-7 h-7 bg-white text-[#2c1810] rounded-full flex items-center justify-center text-base font-bold shadow-lg hover:bg-[#bc8a5f] hover:text-white transition-colors active:scale-90"
                >
                  +
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Muted Description */}
        <div className="px-1 pb-1">
          {product.description && (
            <p className="text-[#2c1810] text-[9px] font-medium leading-tight opacity-70 line-clamp-2 italic">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Compact Remove Button */}
      {inCart && (
        <div className="px-1 pb-1 mt-2">
          <button
            onClick={() => removeFromCart(product._id)}
            className="w-full py-1.5 bg-[#2c1810] text-white rounded-lg text-[8px] font-black uppercase tracking-widest transition-all hover:bg-red-900"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}