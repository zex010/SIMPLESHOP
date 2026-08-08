import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Search,
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Heart,
  ShoppingBag,
  SearchX,
} from "lucide-react";

import BrandLogo from "./BrandLogo";
import { useShop } from "../context/ShopContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, wishlistCount } = useShop();

  const [country, setCountry] = useState("Region");
  const [language, setLanguage] = useState("English");
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);

  const searchPanelRef = useRef(null);
  const searchInputRef = useRef(null);

  const isHomePage =
    location.pathname === "/" || location.pathname === "/home";

  // Close the search panel automatically whenever the route changes
  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  // Load the product catalogue once, the first time search is opened,
  // then keep it cached so every subsequent page has instant search.
  useEffect(() => {
    if (!searchOpen || productsLoaded || productsLoading) return;

    setProductsLoading(true);
    fetch("https://avernus-api.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data.products || []);
        setProductsLoaded(true);
      })
      .catch((error) => {
        console.log("Search Products Error:", error);
      })
      .finally(() => setProductsLoading(false));
  }, [searchOpen, productsLoaded, productsLoading]);

  // Focus the input as soon as the panel opens
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchOpen &&
        searchPanelRef.current &&
        !searchPanelRef.current.contains(e.target)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  // Live, case-insensitive, instant filtering — matches from the very
  // first letter typed, no Enter key required.
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return allProducts
      .filter((product) => {
        const name = product.name?.toLowerCase() || "";
        const brand = product.brand?.toLowerCase() || "";
        return name.includes(q) || brand.includes(q);
      })
      .slice(0, 8);
  }, [searchQuery, allProducts]);

  const handleSelectResult = (productId) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(`/product/${productId}`);
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/home");
    }
  };

  useEffect(() => {
    const savedCountry = localStorage.getItem("region");
    const savedLanguage = localStorage.getItem("language");

    if (savedCountry) setCountry(savedCountry);
    if (savedLanguage) setLanguage(savedLanguage);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setContactOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const primaryMenuItems = [
    { title: "NEW IN", path: "/new-arrivals" },
    { title: "MEN", path: "/men" },
    { title: "WOMEN", path: "/women" },
    { title: "COLLECTION", path: "/collection" },
    { title: "BEST SELLERS", path: "/best-sellers" },
    { title: "WISHLIST", path: "/wishlist" },
    { title: "CART", path: "/cart" },
  ];

  const accountMenuItems = [
    { title: "SIGN IN", path: "/signin" },
    { title: "MY ORDERS", path: "/orders" },
  ];

  const brandMenuItems = [
    { title: "ABOUT", path: "/about" },
    { title: "JOURNAL", path: "/journal" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-stone-900 text-stone-100 border-b border-stone-800 relative z-[100]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-9 md:h-10 flex items-center justify-between text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.25em]">
          <div className="flex items-center gap-3 md:gap-8">
            <div className="flex items-center gap-1 cursor-pointer hover:text-stone-300 transition">
              <span>{country}</span>
              <ChevronDown size={11} />
            </div>
            <span>{language}</span>
          </div>

          <span className="hidden md:block text-stone-400">
            Discover the World of Rare Fragrances
          </span>
        </div>
      </div>

      {/* MAIN NAVBAR - Highest z-index to guarantee full clickability */}
      <nav className="sticky top-0 z-[100] bg-white border-b border-stone-200 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="h-16 md:h-20 flex items-center justify-between relative">
            {/* LEFT ACTIONS */}
            <div className="flex items-center gap-3 md:gap-6">
              {!isHomePage && (
                <>
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 uppercase tracking-[0.2em] text-[11px] md:text-xs text-stone-800 hover:text-stone-500 transition font-medium cursor-pointer"
                    title="Go Back"
                  >
                    <ArrowLeft size={15} />
                    <span className="hidden sm:inline">BACK</span>
                  </button>
                  <span className="text-stone-300 font-light hidden sm:inline">
                    |
                  </span>
                </>
              )}

              <button
                onClick={() => setContactOpen(true)}
                className="uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] sm:text-xs md:text-sm text-stone-800 hover:text-stone-500 transition font-medium cursor-pointer"
              >
                + CONTACT
              </button>
            </div>

            {/* BRAND LOGO IN CENTER */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <BrandLogo variant="navbar" />
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3 md:gap-6 text-stone-800">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setContactOpen(false);
                  setSearchOpen((prev) => !prev);
                }}
                aria-label="Search"
                aria-expanded={searchOpen}
                className={`hover:text-stone-500 transition p-1 cursor-pointer ${
                  searchOpen ? "text-stone-500" : ""
                }`}
              >
                <Search size={18} strokeWidth={1.5} className="md:w-5 md:h-5" />
              </button>

              <button
                onClick={() => navigate("/wishlist")}
                aria-label="Wishlist"
                className="relative hover:text-stone-500 transition p-1 cursor-pointer hidden sm:flex"
              >
                <Heart size={18} strokeWidth={1.5} className="md:w-5 md:h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-stone-900 text-white text-[9px] flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate("/cart")}
                aria-label="Cart"
                className="relative hover:text-stone-500 transition p-1 cursor-pointer"
              >
                <ShoppingBag size={18} strokeWidth={1.5} className="md:w-5 md:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-stone-900 text-white text-[9px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMenuOpen(true)}
                className="flex items-center gap-1.5 uppercase tracking-[0.2em] md:tracking-[0.35em] text-[11px] md:text-sm hover:text-stone-500 transition font-medium cursor-pointer"
              >
                <Menu size={18} className="md:w-5 md:h-5" />
                <span className="hidden sm:inline">MENU</span>
              </button>
            </div>
          </div>
        </div>

        {/* LIVE SEARCH DROPDOWN */}
        <div
          ref={searchPanelRef}
          className={`absolute left-0 right-0 top-full bg-white border-b border-stone-200 shadow-xl transition-all duration-300 ease-out origin-top ${
            searchOpen
              ? "opacity-100 translate-y-0 scale-y-100 pointer-events-auto"
              : "opacity-0 -translate-y-2 scale-y-95 pointer-events-none"
          }`}
        >
          <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-8">
            <div className="relative">
              <Search
                size={16}
                strokeWidth={1.5}
                className="absolute left-1 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH PERFUMES, NOTES..."
                className="w-full bg-transparent border-b border-stone-300 py-2 sm:py-3 pl-7 pr-8 text-xs sm:text-sm tracking-[0.2em] focus:outline-none focus:border-stone-900 transition-colors text-stone-900 placeholder:text-stone-400 font-light uppercase"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* RESULTS */}
            {searchQuery.trim() && (
              <div className="mt-6 max-h-[60vh] overflow-y-auto">
                {productsLoading ? (
                  <p className="text-center text-xs uppercase tracking-[0.25em] text-stone-400 py-8">
                    Searching...
                  </p>
                ) : searchResults.length > 0 ? (
                  <ul className="flex flex-col divide-y divide-stone-100">
                    {searchResults.map((product) => (
                      <li key={product._id}>
                        <button
                          onClick={() => handleSelectResult(product._id)}
                          className="w-full flex items-center gap-4 py-3 text-left group cursor-pointer"
                        >
                          <div className="h-14 w-14 md:h-16 md:w-16 shrink-0 overflow-hidden bg-[#f8f8f8]">
                            <img
                              src={`https://avernus-api.onrender.com${product.image}`}
                              alt={product.name}
                              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="uppercase tracking-[0.25em] text-[10px] text-stone-400">
                              {product.brand}
                            </p>
                            <p className="font-serif text-base md:text-lg text-stone-900 truncate group-hover:text-stone-500 transition-colors">
                              {product.name}
                            </p>
                            {product.description && (
                              <p className="text-xs text-stone-400 truncate mt-0.5 hidden sm:block">
                                {product.description}
                              </p>
                            )}
                          </div>

                          <span className="shrink-0 text-xs sm:text-sm tracking-[0.15em] text-stone-700">
                            ${product.price}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <SearchX size={22} className="text-stone-300 mb-3" />
                    <p className="uppercase tracking-[0.25em] text-xs text-stone-400">
                      No perfumes found.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* SLIDE-FROM-LEFT CONTACT DRAWER */}
      <div
        onClick={() => setContactOpen(false)}
        className={`fixed inset-0 bg-black/40 z-[1000] transition-opacity duration-500 ${
          contactOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
        className={`fixed top-0 left-0 bottom-0 w-full max-w-sm sm:max-w-md bg-white text-stone-900 z-[1001] shadow-2xl transition-transform duration-500 ease-in-out flex flex-col justify-between p-6 sm:p-10 border-r border-stone-200 ${
          contactOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between border-b border-stone-200 pb-5 mb-6 sm:mb-8">
            <h2 className="font-serif text-xl sm:text-2xl tracking-[0.2em] uppercase text-stone-900">
              Contact Us
            </h2>
            <button
              onClick={() => setContactOpen(false)}
              aria-label="Close Contact Drawer"
              className="hover:opacity-50 transition p-1 cursor-pointer text-stone-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3.5">
              <Phone size={16} className="mt-1 text-stone-500 shrink-0" />
              <div>
                <p className="uppercase tracking-[0.2em] text-[10px] text-stone-400 mb-0.5">
                  Client Concierge
                </p>
                <a
                  href="tel:+923139264574"
                  className="text-xs sm:text-sm font-light tracking-widest hover:underline text-stone-800"
                >
                  +92 313 9264574
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <MessageCircle
                size={16}
                className="mt-1 text-stone-500 shrink-0"
              />
              <div>
                <p className="uppercase tracking-[0.2em] text-[10px] text-stone-400 mb-0.5">
                  Private Consultation
                </p>
                <a
                  href="https://wa.me/923139264574"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-light tracking-widest hover:underline text-stone-800"
                >
                  +92 313 9264574
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Mail size={16} className="mt-1 text-stone-500 shrink-0" />
              <div>
                <p className="uppercase tracking-[0.2em] text-[10px] text-stone-400 mb-0.5">
                  Maison Correspondence
                </p>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=avernusparfums@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-light tracking-wider hover:underline break-all text-stone-800"
                >
                  avernusparfums@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Clock size={16} className="mt-1 text-stone-500 shrink-0" />
              <div>
                <p className="uppercase tracking-[0.2em] text-[10px] text-stone-400 mb-0.5">
                  Customer Care Hours
                </p>
                <p className="text-xs sm:text-sm font-light tracking-wider text-stone-800">
                  Monday to Sunday
                </p>
                <p className="text-[11px] font-light text-stone-500 tracking-wider">
                  10:00 AM – 7:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 pt-5 text-center">
          <p className="font-serif text-lg tracking-[0.25em] text-stone-800 uppercase">
            Maison AVERNUS
          </p>
          <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400 mt-0.5">
            Inspired by the world's finest perfume traditions, our creations celebrate sophistication, individuality, and enduring luxury.
          </p>
        </div>
      </div>

      {/* MENU DRAWER (UNCHANGED) */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300 ease-in-out ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 bottom-0 w-full lg:w-[40vw] bg-white text-stone-900 z-[9999] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col justify-between border-r border-stone-200 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 md:h-20 border-b border-stone-200 flex items-center justify-between px-6 md:px-10 shrink-0 bg-white">
          <BrandLogo variant="navbar" />

          <button
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 uppercase tracking-[0.2em] text-[11px] md:text-xs text-stone-600 hover:text-black transition cursor-pointer p-1"
          >
            <X size={18} />
            <span>CLOSE</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6 md:py-8 flex flex-col justify-between">
          <div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="relative mb-8 w-full flex items-center justify-between border-b border-stone-300 py-2 sm:py-3 pl-1 pr-2 text-xs tracking-[0.2em] text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-colors font-light uppercase cursor-pointer"
            >
              SEARCH PERFUMES, NOTES...
              <Search size={16} />
            </button>

            <div className="flex flex-col space-y-1">
              {primaryMenuItems.map((item) => {
                const count =
                  item.title === "CART"
                    ? cartCount
                    : item.title === "WISHLIST"
                    ? wishlistCount
                    : 0;

                return (
                  <button
                    key={item.title}
                    onClick={() => handleNavigation(item.path)}
                    className="group flex items-center justify-between py-2.5 border-b border-stone-100 transition-colors duration-200 cursor-pointer text-stone-800 hover:text-black text-left"
                  >
                    <span className="font-serif text-lg md:text-xl tracking-[0.15em] uppercase font-light group-hover:translate-x-1.5 transition-transform duration-200 flex items-center gap-3">
                      {item.title}
                      {count > 0 && (
                        <span className="font-sans text-[10px] tracking-normal bg-stone-900 text-white rounded-full h-5 w-5 flex items-center justify-center">
                          {count}
                        </span>
                      )}
                    </span>
                    <ArrowRight
                      size={16}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-stone-500"
                    />
                  </button>
                );
              })}
            </div>

            <div className="pt-6 mt-6 border-t border-stone-200 flex flex-col space-y-2">
              <p className="uppercase tracking-[0.25em] text-[10px] text-stone-400 font-medium mb-1">
                ACCOUNT
              </p>
              {accountMenuItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleNavigation(item.path)}
                  className="text-left text-xs sm:text-sm tracking-[0.2em] uppercase font-medium text-stone-600 hover:text-black transition-colors py-1 cursor-pointer"
                >
                  {item.title}
                </button>
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-stone-200 flex flex-col space-y-2">
              <p className="uppercase tracking-[0.25em] text-[10px] text-stone-400 font-medium mb-1">
                DISCOVER
              </p>
              {brandMenuItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleNavigation(item.path)}
                  className="text-left text-xs sm:text-sm tracking-[0.2em] uppercase font-medium text-stone-600 hover:text-black transition-colors py-1 cursor-pointer"
                >
                  {item.title}
                </button>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setContactOpen(true);
                }}
                className="text-left text-xs sm:text-sm tracking-[0.2em] uppercase font-medium text-stone-600 hover:text-black transition-colors py-1 cursor-pointer"
              >
                CONTACT
              </button>
            </div>
          </div>
        </div>
<div className="border-t border-stone-200 px-6 md:px-10 py-8 bg-white text-center">
  <h3 className="font-serif text-xl tracking-[0.2em] uppercase text-stone-900">
    Crafted for Distinction
  </h3>

  <p className="mt-4 text-[11px] leading-6 tracking-[0.08em] text-stone-500 max-w-[280px] mx-auto">
    Every fragrance is meticulously crafted to embody timeless elegance,
    exceptional quality, and unforgettable character. Discover a world where
    artistry meets luxury, and every scent tells a story.
  </p>

  <div className="mt-6 pt-4 border-t border-stone-100 flex justify-between text-[10px] uppercase tracking-[0.25em] text-stone-400">
    <span>AVERNUS © 2026</span>
    <span>The Essence of Elegance</span>
  </div>
</div>
       
      </aside>
    </>
  );
}