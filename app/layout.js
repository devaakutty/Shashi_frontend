import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Shisha Chocolate & Dessert | Artisan Lounge",
  description: "Premium chocolate and dessert management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Applied the Sage Green background (#f4f9f6) globally 
        and ensured a clean font rendering.
      */}
      <body className="bg-[#f4f9f6] text-[#1a2e1f] antialiased selection:bg-[#3d634a] selection:text-white">
        <AuthProvider>
          <CartProvider>
            {/* The Navbar will now sit perfectly over the Sage background */}
            <Navbar />
            
            {/* Setting a max-width and centering helps keep the 
              Botanical Bliss "one-page" look across different monitors.
            */}
            <div className="relative overflow-x-hidden">
              {children}
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}