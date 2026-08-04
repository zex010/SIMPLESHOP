import React from "react";
import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-100 border-t border-stone-800 pt-16 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-stone-800">

        {/* Brand */}
        <div className="md:col-span-5 flex flex-col items-start gap-5">
          <BrandLogo variant="splash" />

          <p className="text-sm text-stone-400 leading-7 max-w-sm">
            Artisanal fragrance creations crafted to evoke timeless memories,
            refined elegance, and the enduring spirit of luxury.
          </p>
        </div>

        {/* Footer Links */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">

          <div>
            <h3 className="uppercase tracking-[0.25em] text-white mb-4 font-serif">
              Boutique
            </h3>

            <ul className="space-y-3 text-stone-400">
              <li><Link to="/new-arrivals" className="hover:text-white transition">New In</Link></li>
              <li><Link to="/collection" className="hover:text-white transition">Collections</Link></li>
              <li><Link to="/best-sellers" className="hover:text-white transition">Best Sellers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="uppercase tracking-[0.25em] text-white mb-4 font-serif">
              Account
            </h3>

            <ul className="space-y-3 text-stone-400">
              <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition">Wishlist</Link></li>
              <li><Link to="/orders" className="hover:text-white transition">My Orders</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="uppercase tracking-[0.25em] text-white mb-4 font-serif">
              Company
            </h3>

            <ul className="space-y-3 text-stone-400">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/journal" className="hover:text-white transition">Journal</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center text-xs tracking-[0.2em] uppercase text-stone-500 gap-4">
        <span>© 2026 MAISON AVERNUS. All Rights Reserved.</span>
        <span>Crafted with Precision</span>
      </div>
    </footer>
  );
}