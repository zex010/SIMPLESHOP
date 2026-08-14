import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ScrollToTop from "./components/ScrollToTop";

import Splash from "./pages/Splash";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Collection from "./pages/Collection";
import Men from "./pages/Men";
import Women from "./pages/Women";
import SignIn from "./pages/SignIn";
import NewArrival from "./pages/NewArrival";
import BestSellers from "./pages/Bestsellers";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/MyOrders";
import Journal from "./pages/Journal";
import JournalArticle from "./pages/JournalArticle";
import PrivacyPolicy from "./pages/Privacypolicy";
import About from "./pages/About"; // <-- Real About page import

import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

// SEARCH PAGE COMPONENT
const SearchPage = () => (
  <h1 style={{ padding: "40px" }}>Search Page</h1>
);

// CONTACT PAGE COMPONENT
const Contact = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/home");
      }
    }, 300);
  };

  return (
    <div
      className={`min-h-screen flex bg-white overflow-hidden transition-all duration-300 ${
        isExiting ? "opacity-0 scale-[0.98]" : ""
      }`}
    >
      <div className="hidden md:block w-[60%] order-2 overflow-hidden">
        <img
          src="/sample.jpg"
          alt="Avernus"
          className="w-full h-screen object-cover blur-md opacity-40"
        />
      </div>

      <div className="w-full md:w-[40%] min-h-screen bg-white flex flex-col items-center pt-32 px-6 relative">
        <button
          onClick={handleBack}
          className="absolute top-8 left-8 hover:opacity-50 transition-opacity"
          aria-label="Go back"
        >
          <ArrowLeft size={26} strokeWidth={1.2} />
        </button>

        <p className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-6">
          Contact Us
        </p>

        <h1 className="text-5xl font-serif tracking-[0.25em] mb-10">
          AVERNUS
        </h1>

        <div className="space-y-6 text-sm uppercase tracking-[0.2em] text-center">
          <a
            href="tel:+923139264574"
            className="block hover:text-gray-500 transition-colors"
          >
            Phone :
            <span className="ml-3 text-gray-600">+92 313 9264574</span>
          </a>

          <a
            href="https://wa.me/923139264574"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-gray-500 transition-colors"
          >
            WhatsApp :
            <span className="ml-3 text-gray-600">03139264574</span>
          </a>

          <a
            href="mailto:avernus@gmail.com"
            className="block hover:text-gray-500 transition-colors"
          >
            Gmail :
            <span className="ml-3 text-gray-600 lowercase">
              avernus@gmail.com
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/new-arrivals" element={<NewArrival />} />
        <Route path="/best-sellers" element={<BestSellers />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/my-orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:id" element={<JournalArticle />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <Admin />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;