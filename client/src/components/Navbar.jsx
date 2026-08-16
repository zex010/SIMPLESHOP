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
  UserRound,
} from "lucide-react";

import BrandLogo from "./BrandLogo";
import { useShop } from "../context/ShopContext";

// R2 + old Render image support
import { resolveImage, getDisplayName } from "../utils/imageUtils";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartCount, wishlistCount } = useShop();

  const [country, setCountry] = useState("Region");
  const [language, setLanguage] = useState("English");

  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);

  // ============================================================
  // LOGIN STATE
  // ============================================================

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(
      localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token")
    );
  });

  const [userName, setUserName] = useState("");

  // ============================================================
  // REFS
  // ============================================================

  const searchPanelRef = useRef(null);
  const searchInputRef = useRef(null);
  const accountRef = useRef(null);

  // ============================================================
  // LOAD USER NAME
  // ============================================================

  useEffect(() => {
    const loadUser = () => {
      const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

      if (!storedUser) {
        setUserName("");
        return;
      }

      try {
        const user = JSON.parse(storedUser);

        setUserName(
          user?.name ||
            user?.username ||
            user?.fullName ||
            user?.email ||
            "My Account"
        );
      } catch (error) {
        console.error("User data error:", error);
        setUserName("");
      }
    };

    loadUser();
  }, [isLoggedIn]);

  // ============================================================
  // CHECK LOGIN STATE WHEN ROUTE CHANGES
  // ============================================================

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = Boolean(
        localStorage.getItem("auth_token") ||
          sessionStorage.getItem("auth_token")
      );

      setIsLoggedIn(loggedIn);

      if (!loggedIn) {
        setUserName("");
      }
    };

    checkAuth();
  }, [location.pathname]);

  // ============================================================
  // STORAGE CHANGE
  // ============================================================

  useEffect(() => {
    const handleStorageChange = () => {
      const loggedIn = Boolean(
        localStorage.getItem("auth_token") ||
          sessionStorage.getItem("auth_token")
      );

      setIsLoggedIn(loggedIn);

      const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);

          setUserName(
            user?.name ||
              user?.username ||
              user?.fullName ||
              user?.email ||
              "My Account"
          );
        } catch {
          setUserName("");
        }
      } else {
        setUserName("");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ============================================================
  // HOME PAGE CHECK
  // ============================================================

  const isHomePage =
    location.pathname === "/" || location.pathname === "/home";

  // ============================================================
  // CLOSE SEARCH + ACCOUNT WHEN ROUTE CHANGES
  // ============================================================

  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery("");
    setAccountOpen(false);
  }, [location.pathname]);

  // ============================================================
  // LOAD PRODUCTS FOR SEARCH
  // ============================================================

  useEffect(() => {
    if (!searchOpen || productsLoaded || productsLoading) return;

    setProductsLoading(true);

    fetch("https://avernus-api.onrender.com/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Products API returned ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        setAllProducts(
          Array.isArray(data.products) ? data.products : []
        );

        setProductsLoaded(true);
      })
      .catch((error) => {
        console.error("Search Products Error:", error);
      })
      .finally(() => {
        setProductsLoading(false);
      });
  }, [searchOpen, productsLoaded, productsLoading]);

  // ============================================================
  // FOCUS SEARCH INPUT
  // ============================================================

  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  // ============================================================
  // CLOSE SEARCH WHEN CLICKING OUTSIDE
  // ============================================================

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

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [searchOpen]);

  // ============================================================
  // CLOSE ACCOUNT DROPDOWN WHEN CLICKING OUTSIDE
  // ============================================================

  useEffect(() => {
    const handleAccountOutside = (e) => {
      if (
        accountOpen &&
        accountRef.current &&
        !accountRef.current.contains(e.target)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleAccountOutside);

    return () => {
      document.removeEventListener("mousedown", handleAccountOutside);
    };
  }, [accountOpen]);

  // ============================================================
  // SEARCH FILTER
  // ============================================================

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

  // ============================================================
  // SELECT SEARCH RESULT
  // ============================================================

  const handleSelectResult = (productId) => {
    setSearchOpen(false);
    setSearchQuery("");

    navigate(`/product/${productId}`);
  };

  // ============================================================
  // BACK
  // ============================================================

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/home");
    }
  };

  // ============================================================
  // LOAD REGION / LANGUAGE
  // ============================================================

  useEffect(() => {
    const savedCountry = localStorage.getItem("region");
    const savedLanguage = localStorage.getItem("language");

    if (savedCountry) {
      setCountry(savedCountry);
    }

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setContactOpen(false);
        setSearchOpen(false);
        setAccountOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ============================================================
  // MENU ITEMS
  // ============================================================

  const primaryMenuItems = [
    { title: "NEW IN", path: "/new-arrivals" },
    { title: "MEN", path: "/men" },
    { title: "WOMEN", path: "/women" },
    { title: "COLLECTION", path: "/collection" },
    { title: "BEST SELLERS", path: "/best-sellers" },
    { title: "WISHLIST", path: "/wishlist" },
    { title: "CART", path: "/cart" },
  ];

  const brandMenuItems = [
    { title: "ABOUT", path: "/about" },
    { title: "JOURNAL", path: "/journal" },
  ];

  // ============================================================
  // NAVIGATION
  // ============================================================

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
    setAccountOpen(false);
  };

  // ============================================================
  // ACCOUNT ICON
  // ============================================================

  const handleAccountClick = () => {
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }

    setAccountOpen((prev) => !prev);
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");

    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    setIsLoggedIn(false);
    setUserName("");
    setAccountOpen(false);

    navigate("/home");
  };

  return (
    <>
      {/* ======================================================
          TOP ANNOUNCEMENT BAR
      ====================================================== */}

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

      {/* ======================================================
          MAIN NAVBAR
      ====================================================== */}

      <nav className="sticky top-0 z-[100] bg-white border-b border-stone-200 relative">

        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="h-16 md:h-20 flex items-center relative">

            {/* ==================================================
                LEFT ACTIONS
            ================================================== */}

            <div className="absolute left-0 flex items-center gap-2.5 md:gap-5">

              {!isHomePage && (
                <button
                  onClick={handleBack}
                  aria-label="Go Back"
                  title="Go Back"
                  className="flex items-center justify-center text-stone-700 hover:text-stone-400 transition p-1 cursor-pointer"
                >
                  <ArrowLeft
                    size={14}
                    strokeWidth={1.5}
                    className="md:w-[16px] md:h-[16px]"
                  />
                </button>
              )}

              {/* CONTACT */}

              <button
                onClick={() => setContactOpen(true)}
                className="uppercase tracking-[0.15em] md:tracking-[0.2em] text-[9px] sm:text-[10px] md:text-xs text-stone-800 hover:text-stone-500 transition font-medium cursor-pointer"
              >
                + CONTACT
              </button>

            </div>

            {/* ==================================================
                CENTER LOGO
            ================================================== */}

            <div className="absolute left-1/2 -translate-x-1/2 z-10">
              <BrandLogo variant="navbar" />
            </div>

            {/* ==================================================
                RIGHT ACTIONS
                FAR RIGHT ON BOTH MOBILE + DESKTOP
            ================================================== */}

            <div
              className="
                absolute
                right-0
                top-1/2
                -translate-y-1/2
                flex
                items-center
                gap-2
                sm:gap-3
                md:gap-4
                lg:gap-5
                text-stone-800
              "
            >

              {/* SEARCH */}

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setContactOpen(false);
                  setAccountOpen(false);
                  setSearchOpen((prev) => !prev);
                }}
                aria-label="Search"
                aria-expanded={searchOpen}
                className={`hidden sm:flex hover:text-stone-500 transition p-1 cursor-pointer ${
                  searchOpen ? "text-stone-500" : ""
                }`}
              >
                <Search
                  size={16}
                  strokeWidth={1.5}
                  className="md:w-[19px] md:h-[19px]"
                />
              </button>

              {/* ==================================================
                  ACCOUNT
              ================================================== */}

              <div
                ref={accountRef}
                className="relative"
              >
                <button
                  onClick={handleAccountClick}
                  aria-label={
                    isLoggedIn ? "My Account" : "Sign In"
                  }
                  title={
                    isLoggedIn ? "My Account" : "Sign In"
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    hover:text-stone-500
                    transition
                    p-0.5
                    sm:p-1
                    cursor-pointer
                  "
                >
                  <UserRound
                    size={15}
                    strokeWidth={1.5}
                    className="
                      sm:w-[17px]
                      sm:h-[17px]
                      md:w-[19px]
                      md:h-[19px]
                    "
                  />
                </button>

                {/* ACCOUNT DROPDOWN */}

                {isLoggedIn && accountOpen && (
                  <div className="absolute right-0 top-full mt-3 w-52 bg-white border border-stone-200 shadow-xl z-[9999]">

                    <div className="px-4 py-4 border-b border-stone-200">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400">
                        Welcome
                      </p>

                      <p className="mt-1 text-sm font-serif text-stone-900 truncate">
                        {userName || "My Account"}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setAccountOpen(false);
                        navigate("/my-orders");
                      }}
                      className="w-full text-left px-4 py-3 text-[10px] uppercase tracking-[0.17em] text-stone-700 hover:bg-stone-50 transition"
                    >
                      MY ORDERS
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 border-t border-stone-100 text-[10px] uppercase tracking-[0.17em] text-stone-700 hover:bg-stone-50 transition"
                    >
                      LOGOUT
                    </button>

                  </div>
                )}
              </div>

              {/* ==================================================
                  WISHLIST
              ================================================== */}

              <button
                onClick={() => navigate("/wishlist")}
                aria-label="Wishlist"
                className="relative flex hover:text-stone-500 transition p-0.5 sm:p-1 cursor-pointer"
              >
                <Heart
                  size={15}
                  strokeWidth={1.5}
                  className="
                    sm:w-[17px]
                    sm:h-[17px]
                    md:w-[19px]
                    md:h-[19px]
                  "
                />

                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-stone-900 text-white text-[8px] flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* ==================================================
                  CART
              ================================================== */}

              <button
                onClick={() => navigate("/cart")}
                aria-label="Cart"
                className="relative flex hover:text-stone-500 transition p-0.5 sm:p-1 cursor-pointer"
              >
                <ShoppingBag
                  size={15}
                  strokeWidth={1.5}
                  className="
                    sm:w-[17px]
                    sm:h-[17px]
                    md:w-[19px]
                    md:h-[19px]
                  "
                />

                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-stone-900 text-white text-[8px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* ==================================================
                  MENU
              ================================================== */}

              <button
                onClick={() => {
                  setAccountOpen(false);
                  setMenuOpen(true);
                }}
                aria-label="Open Menu"
                title="Menu"
                className="
                  flex
                  items-center
                  justify-center
                  hover:text-stone-500
                  transition
                  cursor-pointer
                  p-0
                  sm:p-1
                "
              >
                <Menu
                  size={13}
                  strokeWidth={1.5}
                  className="
                    sm:w-[15px]
                    sm:h-[15px]
                    md:w-[18px]
                    md:h-[18px]
                  "
                />
              </button>

            </div>
          </div>
        </div>

        {/* ======================================================
            LIVE SEARCH DROPDOWN
        ====================================================== */}

        <div
          ref={searchPanelRef}
          className={`absolute left-0 right-0 top-full bg-white border-b border-stone-200 shadow-xl transition-all duration-300 ease-out origin-top ${
            searchOpen
              ? "opacity-100 translate-y-0 scale-y-100 pointer-events-auto"
              : "opacity-0 -translate-y-2 scale-y-95 pointer-events-none"
          }`}
        >

          <div className="max-w-3xl mx-auto px-4 md:px-8 py-5 md:py-7">

            <div className="relative">

              <Search
                size={15}
                strokeWidth={1.5}
                className="absolute left-1 top-1/2 -translate-y-1/2 text-stone-400"
              />

              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH PERFUMES, NOTES..."
                className="w-full bg-transparent border-b border-stone-300 py-2 sm:py-2.5 pl-7 pr-8 text-[9px] sm:text-[10px] md:text-xs tracking-[0.1em] sm:tracking-[0.13em] md:tracking-[0.18em] focus:outline-none focus:border-stone-900 transition-colors text-stone-900 placeholder:text-stone-400 font-light uppercase placeholder:whitespace-nowrap"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 transition cursor-pointer"
                >
                  <X size={15} />
                </button>
              )}

            </div>

            {searchQuery.trim() && (
              <div className="mt-5 max-h-[60vh] overflow-y-auto">

                {productsLoading ? (

                  <p className="text-center text-[10px] uppercase tracking-[0.2em] text-stone-400 py-7">
                    Searching...
                  </p>

                ) : searchResults.length > 0 ? (

                  <ul className="flex flex-col divide-y divide-stone-100">

                    {searchResults.map((product) => {

                      const imageUrl = resolveImage(product.image);

                      const displayName = getDisplayName(
                        product.name
                      );

                      return (
                        <li key={product._id}>

                          <button
                            onClick={() =>
                              handleSelectResult(product._id)
                            }
                            className="w-full flex items-center gap-3 py-2.5 text-left group cursor-pointer"
                          >

                            <div className="h-13 w-13 md:h-15 md:w-15 shrink-0 overflow-hidden bg-[#f8f8f8]">

                              <img
                                src={imageUrl}
                                alt={
                                  displayName ||
                                  "Avernus perfume"
                                }
                                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                onError={(event) => {
                                  if (
                                    !event.currentTarget.src.includes(
                                      "placeholder.png"
                                    )
                                  ) {
                                    event.currentTarget.src =
                                      "/placeholder.png";
                                  }
                                }}
                              />

                            </div>

                            <div className="flex-1 min-w-0">

                              <p className="uppercase tracking-[0.2em] text-[9px] text-stone-400">
                                {product.brand || "AVERNUS"}
                              </p>

                              <p className="font-serif text-sm md:text-base text-stone-900 truncate group-hover:text-stone-500 transition-colors">
                                {displayName}
                              </p>

                              {product.description && (
                                <p className="text-[11px] text-stone-400 truncate mt-0.5 hidden sm:block">
                                  {product.description}
                                </p>
                              )}

                            </div>

                            <span className="shrink-0 text-[10px] sm:text-xs tracking-[0.12em] text-stone-700">
                              ${product.price}
                            </span>

                          </button>

                        </li>
                      );
                    })}

                  </ul>

                ) : (

                  <div className="flex flex-col items-center justify-center py-9 text-center">

                    <SearchX
                      size={20}
                      className="text-stone-300 mb-3"
                    />

                    <p className="uppercase tracking-[0.2em] text-[10px] text-stone-400">
                      No perfumes found.
                    </p>

                  </div>

                )}

              </div>
            )}

          </div>
        </div>

      </nav>

      {/* ======================================================
          CONTACT OVERLAY
      ====================================================== */}

      <div
        onClick={() => setContactOpen(false)}
        className={`fixed inset-0 bg-black/40 z-[1000] transition-opacity duration-500 ${
          contactOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* ======================================================
          CONTACT DRAWER
      ====================================================== */}

      <div
        className={`fixed top-0 left-0 bottom-0 w-full max-w-[320px] sm:max-w-sm bg-white text-stone-900 z-[1001] shadow-2xl transition-transform duration-500 ease-in-out flex flex-col justify-between p-5 sm:p-7 border-r border-stone-200 ${
          contactOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div>

          <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-5">

            <h2 className="font-serif text-lg sm:text-xl tracking-[0.16em] uppercase text-stone-900">
              Contact Us
            </h2>

            <button
              onClick={() => setContactOpen(false)}
              aria-label="Close Contact Drawer"
              className="hover:opacity-50 transition p-1 cursor-pointer text-stone-600"
            >
              <X size={17} />
            </button>

          </div>

          <div className="space-y-4">

            <div className="flex items-start gap-3">

              <Phone
                size={15}
                className="mt-1 text-stone-500 shrink-0"
              />

              <div>

                <p className="uppercase tracking-[0.17em] text-[9px] text-stone-400 mb-0.5">
                  Client Concierge
                </p>

                <a
                  href="tel:+923139264574"
                  className="text-[11px] sm:text-xs font-light tracking-widest hover:underline text-stone-800"
                >
                  +92 313 9264574
                </a>

              </div>

            </div>

            <div className="flex items-start gap-3">

              <MessageCircle
                size={15}
                className="mt-1 text-stone-500 shrink-0"
              />

              <div>

                <p className="uppercase tracking-[0.17em] text-[9px] text-stone-400 mb-0.5">
                  Private Consultation
                </p>

                <a
                  href="https://wa.me/923139264574"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] sm:text-xs font-light tracking-widest hover:underline text-stone-800"
                >
                  +92 313 9264574
                </a>

              </div>

            </div>

            <div className="flex items-start gap-3">

              <Mail
                size={15}
                className="mt-1 text-stone-500 shrink-0"
              />

              <div className="min-w-0">

                <p className="uppercase tracking-[0.17em] text-[9px] text-stone-400 mb-0.5">
                  Maison Correspondence
                </p>

                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=avernusparfums@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] sm:text-xs font-light tracking-wider hover:underline break-all text-stone-800"
                >
                  avernusparfums@gmail.com
                </a>

              </div>

            </div>

            <div className="flex items-start gap-3">

              <Clock
                size={15}
                className="mt-1 text-stone-500 shrink-0"
              />

              <div>

                <p className="uppercase tracking-[0.17em] text-[9px] text-stone-400 mb-0.5">
                  Customer Care Hours
                </p>

                <p className="text-[11px] sm:text-xs font-light tracking-wider text-stone-800">
                  Monday to Sunday
                </p>

                <p className="text-[10px] font-light text-stone-500 tracking-wider">
                  10:00 AM – 7:00 PM
                </p>

              </div>

            </div>

          </div>
        </div>

        <div className="border-t border-stone-200 pt-4 text-center">

          <p className="font-serif text-base tracking-[0.2em] text-stone-800 uppercase">
            Maison AVERNUS
          </p>

          <p className="text-[8px] leading-4 uppercase tracking-[0.16em] text-stone-400 mt-1">
            Inspired by the world's finest perfume traditions,
            our creations celebrate sophistication,
            individuality, and enduring luxury.
          </p>

        </div>

      </div>

      {/* ======================================================
          MENU OVERLAY
      ====================================================== */}

      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300 ease-in-out ${
          menuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      />

      {/* ======================================================
          MENU DRAWER
      ====================================================== */}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-full lg:w-[36vw] xl:w-[34vw] bg-white text-stone-900 z-[9999] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col justify-between border-r border-stone-200 ${
          menuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* MENU HEADER */}

        <div className="h-16 md:h-[72px] border-b border-stone-200 flex items-center justify-between px-5 md:px-8 shrink-0 bg-white">

          <BrandLogo variant="navbar" />

          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close Menu"
            className="flex items-center gap-1.5 uppercase tracking-[0.16em] text-[10px] md:text-[11px] text-stone-600 hover:text-black transition cursor-pointer p-1"
          >
            <X size={17} />
            <span>CLOSE</span>
          </button>

        </div>

        {/* MENU CONTENT */}

        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-5 md:py-6 flex flex-col justify-between">

          <div>

            {/* SEARCH */}

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="relative mb-6 w-full flex items-center justify-between border-b border-stone-300 py-2 sm:py-2.5 pl-1 pr-2 text-[10px] sm:text-[11px] tracking-[0.16em] text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-colors font-light uppercase cursor-pointer"
            >
              SEARCH PERFUMES, NOTES...

              <Search size={15} />
            </button>

            {/* PRIMARY MENU */}

            <div className="flex flex-col space-y-0.5">

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
                    onClick={() =>
                      handleNavigation(item.path)
                    }
                    className="group flex items-center justify-between whitespace-nowrap py-2 border-b border-stone-100 transition-colors duration-200 cursor-pointer text-stone-800 hover:text-black text-left"
                  >

                    <span className="font-serif text-base md:text-lg tracking-[0.13em] uppercase font-light whitespace-nowrap shrink-0 group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-2.5">

                      {item.title}

                      {count > 0 && (
                        <span className="font-sans text-[9px] tracking-normal bg-stone-900 text-white rounded-full h-4.5 w-4.5 flex items-center justify-center">
                          {count}
                        </span>
                      )}

                    </span>

                    <ArrowRight
                      size={15}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-stone-500"
                    />

                  </button>
                );
              })}

            </div>

            {/* ACCOUNT */}

            <div className="pt-5 mt-5 border-t border-stone-200 flex flex-col space-y-1.5">

              <p className="uppercase tracking-[0.22em] text-[9px] text-stone-400 font-medium mb-1">
                ACCOUNT
              </p>

              {!isLoggedIn ? (

                <button
                  onClick={() =>
                    handleNavigation("/signin")
                  }
                  className="text-left text-[10px] sm:text-[11px] tracking-[0.17em] uppercase font-medium text-stone-600 hover:text-black transition-colors py-0.5 cursor-pointer"
                >
                  SIGN IN
                </button>

              ) : (

                <>
                  <button
                    onClick={() =>
                      handleNavigation("/my-orders")
                    }
                    className="text-left text-[10px] sm:text-[11px] tracking-[0.17em] uppercase font-medium text-stone-600 hover:text-black transition-colors py-0.5 cursor-pointer"
                  >
                    MY ORDERS
                  </button>

                  <button
                    onClick={handleLogout}
                    className="text-left text-[10px] sm:text-[11px] tracking-[0.17em] uppercase font-medium text-stone-600 hover:text-black transition-colors py-0.5 cursor-pointer"
                  >
                    LOGOUT
                  </button>
                </>

              )}

            </div>

            {/* DISCOVER */}

            <div className="pt-5 mt-5 border-t border-stone-200 flex flex-col space-y-1.5">

              <p className="uppercase tracking-[0.22em] text-[9px] text-stone-400 font-medium mb-1">
                DISCOVER
              </p>

              {brandMenuItems.map((item) => (

                <button
                  key={item.title}
                  onClick={() =>
                    handleNavigation(item.path)
                  }
                  className="text-left text-[10px] sm:text-[11px] tracking-[0.17em] uppercase font-medium text-stone-600 hover:text-black transition-colors py-0.5 cursor-pointer"
                >
                  {item.title}
                </button>

              ))}

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setContactOpen(true);
                }}
                className="text-left text-[10px] sm:text-[11px] tracking-[0.17em] uppercase font-medium text-stone-600 hover:text-black transition-colors py-0.5 cursor-pointer"
              >
                CONTACT
              </button>

            </div>

          </div>

        </div>

        {/* MENU FOOTER */}

        <div className="border-t border-stone-200 px-5 md:px-8 py-6 bg-white text-center">

          <h3 className="font-serif text-lg tracking-[0.18em] uppercase text-stone-900">
            Crafted for Distinction
          </h3>

          <p className="mt-3 text-[10px] leading-5 tracking-[0.07em] text-stone-500 max-w-[260px] mx-auto">
            Every fragrance is meticulously crafted to embody timeless
            elegance, exceptional quality, and unforgettable character.
            Discover a world where artistry meets luxury.
          </p>

          <div className="mt-5 pt-3 border-t border-stone-100 flex justify-between text-[8px] uppercase tracking-[0.18em] text-stone-400">
            <span>AVERNUS © 2026</span>
            <span>The Essence of Elegance</span>
          </div>

        </div>

      </aside>
    </>
  );
}
