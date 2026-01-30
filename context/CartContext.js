"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ✅ Persist cart in local storage for the lounge session
  useEffect(() => {
    const savedCart = localStorage.getItem("shisha_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart recovery failed", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("shisha_cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Add to Cart with Quantity Support
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ✅ Update specific item quantity
  const updateCartItem = (productId, newQty) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // ✅ Remove specific item
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("shisha_cart");
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        updateCartItem, 
        removeFromCart, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);