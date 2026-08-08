import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShop } from "../context/ShopContext";
import {
  Lock,
  ShieldCheck,
  Loader2,
  CheckCircle,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Truck,
  Landmark,
  CreditCard,
  Check,
} from "lucide-react";

// Updated resolveImage to handle relative paths from backend uploads and fix leading slashes
const FALLBACK_IMAGE = "https://placehold.co/200x200/f5f5f4/78716c?text=No+Image";

const resolveImage = (image) => {
  // Some cart items may carry an `images` array instead of a single `image`
  // string depending on where they were added from — handle both.
  const src = Array.isArray(image) ? image[0] : image;
  if (!src) return FALLBACK_IMAGE;
  if (src.startsWith("http")) return src;
  // Handle leading slashes: strip them first, then append to base URL
  return `https://avernus-api.onrender.com/${src.replace(/^\/+/, "")}`;
};

const PAYMENT_METHODS = [
  {
    id: "Cash On Delivery",
    label: "Cash On Delivery",
    description: "Pay with cash when your order arrives.",
    icon: Truck,
    disabled: false,
  },
  {
    id: "Bank Transfer",
    label: "Bank Transfer",
    description: "Bank details will be emailed after you confirm.",
    icon: Landmark,
    disabled: false,
  },
  {
    id: "Card",
    label: "Credit / Debit Card",
    description: "Coming soon via Stripe.",
    icon: CreditCard,
    disabled: true,
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  // Imported placeOrder from context
  const { cart, placeOrder } = useShop();

  // Guard: your Order model requires a logged-in user, so checkout needs a
  // valid session token before it can succeed. SignIn.jsx stores the JWT as
  // "auth_token" — in localStorage ("Remember Me") or sessionStorage otherwise.
  const isLoggedIn = Boolean(
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  );

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
  const [orderResult, setOrderResult] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Pakistan",
  });

  const subtotal = (cart || []).reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.qty || 1),
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.address.trim()) newErrors.address = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.province.trim()) newErrors.province = "Province / State is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToReview = (e) => {
    e.preventDefault();
    setApiError("");

    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setApiError("Please fill in all required shipping fields before continuing.");
    }
  };

  const handleContinueToPayment = () => {
    setApiError("");
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    setApiError("");

    // Your Order schema requires selectedSize on every item — catch a
    // missing size here with a clear message instead of letting the
    // Mongoose validation error reach the user as raw text.
    const itemsMissingSize = cart.filter((item) => !item.selectedSize);
    if (itemsMissingSize.length > 0) {
      const names = itemsMissingSize.map((item) => item.name).join(", ");
      setApiError(
        `No size selected for: ${names}. Please return to your cart, remove and re-add the item with a size, then try again.`
      );
      return;
    }

    setLoading(true);

    // Prepare data for MongoDB
    const orderItems = cart.map(item => ({
      product: item._id, // MongoDB ID
      name: item.name,
      image: item.image,
      selectedSize: item.selectedSize,
      qty: item.qty,
      price: item.price
    }));

    const orderPayload = {
      orderItems,
      shippingAddress: formData,
      totalPrice: subtotal,
      paymentMethod, // Chosen in the Payment step
    };

    try {
      // Call context function which calls backend API
      const result = await placeOrder(orderPayload);

      setOrderResult(result?.order || null);
      setLoading(false);
      setStep(4); // Show success step

      // Redirect after delay
      setTimeout(() => {
        navigate("/my-orders");
      }, 2500);
    } catch (err) {
      console.error("Failed to place order:", err);
      setLoading(false);

      // Extract backend error message
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Unable to process order. Please check your connection.";

      setApiError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans antialiased flex flex-col selection:bg-stone-900 selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* BRAND HEADER & STEPPER */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-[0.3em] text-stone-950 uppercase font-light">
            AVERNUS
          </h1>

          {cart && cart.length > 0 && isLoggedIn && step < 4 && (
            <div className="flex items-center justify-center gap-3 sm:gap-6 mt-8 text-[11px] uppercase tracking-[0.25em] font-medium text-stone-400">
              <span
                onClick={() => setStep(1)}
                className={`transition-colors duration-300 ${
                  step === 1 ? "text-stone-950 font-semibold" : "cursor-pointer hover:text-stone-700"
                }`}
              >
                01. Shipping Details
              </span>
              <span className="w-6 h-[1px] bg-stone-200" />
              <span
                onClick={() => step > 2 && setStep(2)}
                className={`transition-colors duration-300 ${
                  step === 2
                    ? "text-stone-950 font-semibold"
                    : step > 2
                    ? "cursor-pointer hover:text-stone-700"
                    : ""
                }`}
              >
                02. Order Review
              </span>
              <span className="w-6 h-[1px] bg-stone-200" />
              <span
                className={`transition-colors duration-300 ${
                  step === 3 ? "text-stone-950 font-semibold" : ""
                }`}
              >
                03. Payment
              </span>
            </div>
          )}
          <div className="w-16 h-[1px] bg-stone-200 mx-auto mt-6" />
        </div>

        {/* LOGIN REQUIRED STATE */}
        {!isLoggedIn && step < 4 ? (
          <div className="max-w-md mx-auto py-20 px-6 text-center bg-white border border-stone-100 rounded-2xl shadow-sm my-8">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-stone-100">
              <Lock size={30} className="text-stone-400 stroke-[1.2]" />
            </div>
            <h2 className="font-serif text-2xl tracking-[0.15em] uppercase text-stone-950 mb-3">
              Please Log In
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-8 leading-relaxed font-light">
              An AVERNUS account is required to complete checkout.
            </p>
            <button
              type="button"
              onClick={() => navigate("/signin", { state: { from: "/checkout" } })}
              className="w-full py-4 bg-stone-950 text-white text-xs uppercase tracking-[0.25em] font-medium rounded-lg hover:bg-stone-800 transition-all shadow-sm cursor-pointer"
            >
              Log In To Continue
            </button>
          </div>
        ) : /* EMPTY CART STATE */
        (!cart || cart.length === 0) && step < 4 ? (
          <div className="max-w-md mx-auto py-20 px-6 text-center bg-white border border-stone-100 rounded-2xl shadow-sm my-8">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-stone-100">
              <ShoppingBag size={32} className="text-stone-400 stroke-[1.2]" />
            </div>
            <h2 className="font-serif text-2xl tracking-[0.15em] uppercase text-stone-950 mb-3">
              Your Bag Is Empty
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-8 leading-relaxed font-light">
              Explore our signature collections before proceeding to checkout.
            </p>
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="w-full py-4 bg-stone-950 text-white text-xs uppercase tracking-[0.25em] font-medium rounded-lg hover:bg-stone-800 transition-all shadow-sm cursor-pointer"
            >
              Return to Cart
            </button>
          </div>
        ) : step === 4 ? (
          /* STEP 4: SUCCESS ANIMATION & CARD */
          <div className="max-w-xl mx-auto bg-white p-8 sm:p-14 rounded-2xl border border-stone-100 shadow-sm text-center space-y-6 animate-fade-in my-auto">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
              <CheckCircle
                size={40}
                className="text-emerald-600 stroke-[1.5]"
              />
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.15em] uppercase text-stone-950">
                Your Order Has Been Booked Successfully
              </h2>
              <p className="text-xs uppercase tracking-[0.25em] text-stone-500 font-light max-w-sm mx-auto">
                Thank you for choosing AVERNUS.
              </p>
            </div>

            <div className="bg-stone-50/60 border border-stone-100 rounded-xl p-6 text-left space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]">
                <span className="text-stone-400">Order ID</span>
                <span className="font-mono text-stone-900 font-medium">
                  #{(orderResult?._id || "").slice(-8).toUpperCase() || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]">
                <span className="text-stone-400">Order Date</span>
                <span className="text-stone-900 font-medium">
                  {orderResult?.createdAt
                    ? new Date(orderResult.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]">
                <span className="text-stone-400">Payment Method</span>
                <span className="text-stone-900 font-medium">
                  {orderResult?.paymentMethod || paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <span className="text-xs uppercase tracking-[0.25em] font-bold text-stone-950">
                  Total Amount
                </span>
                <span className="font-serif text-xl text-stone-950 font-semibold">
                  ${orderResult?.totalPrice ?? subtotal}
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 flex items-center justify-center gap-3 text-stone-400 text-xs uppercase tracking-[0.2em] font-light">
              <Loader2 size={16} className="animate-spin text-stone-500" />
              <span>Redirecting to your orders...</span>
            </div>
          </div>
        ) : (
          /* CHECKOUT GRID FOR STEPS 1 AND 2 */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
            {/* MAIN CONTENT AREA */}
            <div className="lg:col-span-7">
              {/* STEP 1: CUSTOMER INFORMATION */}
              {step === 1 && (
                <div className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-100 shadow-sm transition-all duration-300">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-5 mb-8">
                    <h2 className="font-serif text-2xl tracking-[0.15em] uppercase text-stone-950">
                      Shipping Information
                    </h2>
                    <div className="flex items-center gap-2 text-stone-400 text-xs tracking-wider uppercase font-light">
                      <Lock size={14} />
                      <span>Encrypted Checkout</span>
                    </div>
                  </div>

                  {apiError && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2.5 relative">
                       <AlertCircle size={16} className="shrink-0 text-rose-600" />
                       <span>{apiError}</span>
                    </div>
                  )}

                  <form onSubmit={handleContinueToReview} className="space-y-6">
                    {/* FULL NAME */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-600 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Gabriel Vance"
                        className={`w-full px-4 py-3.5 bg-stone-50/50 border rounded-lg text-sm text-stone-950 focus:bg-white focus:outline-none transition-all ${
                          errors.name
                            ? "border-rose-400"
                            : "border-stone-200 focus:border-stone-950"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-rose-500 text-xs mt-1.5 tracking-wide">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* EMAIL & PHONE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-600 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. client@avernus.com"
                          className={`w-full px-4 py-3.5 bg-stone-50/50 border rounded-lg text-sm text-stone-950 focus:bg-white focus:outline-none transition-all ${
                            errors.email
                              ? "border-rose-400"
                              : "border-stone-200 focus:border-stone-950"
                          }`}
                        />
                        {errors.email && (
                          <p className="text-rose-500 text-xs mt-1.5 tracking-wide">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-600 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+92 300 0000000"
                          className={`w-full px-4 py-3.5 bg-stone-50/50 border rounded-lg text-sm text-stone-950 focus:bg-white focus:outline-none transition-all ${
                            errors.phone
                              ? "border-rose-400"
                              : "border-stone-200 focus:border-stone-950"
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-rose-500 text-xs mt-1.5 tracking-wide">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* STREET ADDRESS */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-600 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House number, avenue, or building suite"
                        className={`w-full px-4 py-3.5 bg-stone-50/50 border rounded-lg text-sm text-stone-950 focus:bg-white focus:outline-none transition-all ${
                          errors.address
                            ? "border-rose-400"
                            : "border-stone-200 focus:border-stone-950"
                        }`}
                      />
                      {errors.address && (
                        <p className="text-rose-500 text-xs mt-1.5 tracking-wide">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    {/* CITY & PROVINCE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-600 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="e.g. Lahore"
                          className={`w-full px-4 py-3.5 bg-stone-50/50 border rounded-lg text-sm text-stone-950 focus:bg-white focus:outline-none transition-all ${
                            errors.city
                              ? "border-rose-400"
                              : "border-stone-200 focus:border-stone-950"
                          }`}
                        />
                        {errors.city && (
                          <p className="text-rose-500 text-xs mt-1.5 tracking-wide">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-600 mb-2">
                          Province / State *
                        </label>
                        <input
                          type="text"
                          name="province"
                          value={formData.province}
                          onChange={handleInputChange}
                          placeholder="e.g. Punjab"
                          className={`w-full px-4 py-3.5 bg-stone-50/50 border rounded-lg text-sm text-stone-950 focus:bg-white focus:outline-none transition-all ${
                            errors.province
                              ? "border-rose-400"
                              : "border-stone-200 focus:border-stone-950"
                          }`}
                        />
                        {errors.province && (
                          <p className="text-rose-500 text-xs mt-1.5 tracking-wide">
                            {errors.province}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* POSTAL CODE & COUNTRY */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-600 mb-2">
                          Postal Code{" "}
                          <span className="text-stone-400 font-normal">
                            (Optional)
                          </span>
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="e.g. 54000"
                          className="w-full px-4 py-3.5 bg-stone-50/50 border border-stone-200 rounded-lg text-sm text-stone-950 focus:bg-white focus:border-stone-950 focus:outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-600 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder="e.g. Pakistan"
                          className={`w-full px-4 py-3.5 bg-stone-50/50 border rounded-lg text-sm text-stone-950 focus:bg-white focus:outline-none transition-all ${
                            errors.country
                              ? "border-rose-400"
                              : "border-stone-200 focus:border-stone-950"
                          }`}
                        />
                        {errors.country && (
                          <p className="text-rose-500 text-xs mt-1.5 tracking-wide">
                            {errors.country}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* CONTINUE BUTTON */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        className="w-full py-4 bg-stone-950 text-white text-xs uppercase tracking-[0.25em] font-medium rounded-lg hover:bg-stone-800 transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer group"
                      >
                        <span>Continue</span>
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 2: ORDER REVIEW */}
              {step === 2 && (
                <div className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-100 shadow-sm space-y-8 transition-all duration-300">
                  <div className="border-b border-stone-100 pb-5">
                    <h2 className="font-serif text-2xl tracking-[0.15em] uppercase text-stone-950">
                      Review Your Order
                    </h2>
                  </div>

                  {apiError && (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2.5">
                       <AlertCircle size={16} className="shrink-0 text-rose-600" />
                       <span>{apiError}</span>
                    </div>
                  )}

                  {/* SHIPPING SUMMARY */}
                  <div className="bg-stone-50/60 border border-stone-100 rounded-xl p-6 space-y-2">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-950 mb-3">
                      Shipping Destination
                    </h3>
                    <p className="text-sm font-medium text-stone-900">{formData.name}</p>
                    <p className="text-xs text-stone-600 leading-relaxed font-light">
                      {formData.address}, {formData.city}, {formData.province}
                    </p>
                    <p className="text-xs text-stone-600 font-light">
                      {formData.postalCode}, {formData.country}
                    </p>
                    <p className="text-xs text-stone-600 font-light pt-1">{formData.email} &middot; {formData.phone}</p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={loading}
                      className="w-full sm:w-1/3 py-4 border border-stone-200 text-stone-800 text-xs uppercase tracking-[0.2em] font-medium rounded-lg hover:bg-stone-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ArrowLeft size={16} />
                      <span>Back to Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleContinueToPayment}
                      className="w-full sm:w-2/3 py-4 bg-stone-950 text-white text-xs uppercase tracking-[0.25em] font-medium rounded-lg hover:bg-stone-800 transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer group"
                    >
                      <span>Continue To Payment</span>
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {step === 3 && (
                <div className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-100 shadow-sm space-y-8 transition-all duration-300">
                  <div className="border-b border-stone-100 pb-5">
                    <h2 className="font-serif text-2xl tracking-[0.15em] uppercase text-stone-950">
                      Select Payment Method
                    </h2>
                  </div>

                  {apiError && (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2.5">
                       <AlertCircle size={16} className="shrink-0 text-rose-600" />
                       <span>{apiError}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {PAYMENT_METHODS.map(({ id, label, description, icon: Icon, disabled }) => {
                      const selected = paymentMethod === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          disabled={disabled}
                          onClick={() => setPaymentMethod(id)}
                          className={`w-full flex items-center gap-4 p-5 rounded-xl border text-left transition-all ${
                            disabled
                              ? "border-stone-100 bg-stone-50/50 opacity-50 cursor-not-allowed"
                              : selected
                              ? "border-stone-950 bg-stone-50/60 shadow-sm cursor-pointer"
                              : "border-stone-200 hover:border-stone-400 cursor-pointer"
                          }`}
                        >
                          <div className="h-11 w-11 rounded-full bg-white border border-stone-200 flex items-center justify-center shrink-0">
                            <Icon size={18} strokeWidth={1.5} className="text-stone-800" />
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-medium tracking-wide text-stone-950 flex items-center gap-2">
                              {label}
                              {disabled && (
                                <span className="text-[9px] uppercase tracking-[0.15em] text-stone-400 border border-stone-200 rounded-full px-2 py-0.5">
                                  Coming Soon
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-stone-500 font-light mt-0.5">
                              {description}
                            </p>
                          </div>
                          {!disabled && (
                            <div
                              className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                selected
                                  ? "bg-stone-950 border-stone-950"
                                  : "border-stone-300"
                              }`}
                            >
                              {selected && <Check size={14} className="text-white" />}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={loading}
                      className="w-full sm:w-1/3 py-4 border border-stone-200 text-stone-800 text-xs uppercase tracking-[0.2em] font-medium rounded-lg hover:bg-stone-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ArrowLeft size={16} />
                      <span>Back to Review</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePlaceOrder} // calls backend API
                      disabled={loading}
                      className="w-full sm:w-2/3 py-4 bg-stone-950 text-white text-xs uppercase tracking-[0.25em] font-medium rounded-lg hover:bg-stone-800 transition-all shadow-md flex items-center justify-center gap-3 disabled:bg-stone-400"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-stone-300" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>Confirm Order • ${subtotal}</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 flex items-center justify-center gap-2 text-stone-400 text-xs tracking-wider uppercase font-light">
                <ShieldCheck size={16} className="text-stone-400" />
                <span>Complimentary Express Shipping & Returns</span>
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-100 shadow-sm space-y-6">
                <h2 className="font-serif text-xl tracking-[0.15em] uppercase border-b border-stone-100 pb-4 text-stone-950">
                  Order Summary ({(cart || []).reduce((total, item) => total + item.qty, 0)})
                </h2>

                {/* PRODUCT LIST */}
                <div className="divide-y divide-stone-100 max-h-[380px] overflow-y-auto pr-1">
                  {(cart || []).map((item) => (
                    <div
                      key={`${item._id}-${item.selectedSize}`}
                      className="py-4 flex gap-4 items-center first:pt-0 last:pb-0"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-50 rounded-xl p-2 shrink-0 border border-stone-100 flex items-center justify-center">
                        <img
                          src={resolveImage(item.image)}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                          }}
                        />
                      </div>

                      <div className="flex-grow min-w-0">
                        <p className="text-[9px] uppercase tracking-[0.25em] text-stone-400 font-mono">
                          {item.brand || "AVERNUS"}
                        </p>
                        <h3 className="font-serif text-base text-stone-950 truncate">
                          {item.name}
                        </h3>
                        <p className="text-[11px] uppercase tracking-[0.15em] text-stone-500 mt-0.5">
                          Size: {item.selectedSize} • Qty: {item.qty}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-serif text-sm font-medium text-stone-950">
                          ${Number(item.price) * Number(item.qty)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* COST BREAKDOWN */}
                <div className="border-t border-stone-100 pt-5 space-y-3 text-xs uppercase tracking-[0.15em] text-stone-600 font-light">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-stone-900 font-medium">${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-emerald-700 font-semibold tracking-wider">
                      Complimentary
                    </span>
                  </div>
                </div>

                {/* TOTAL */}
                <div className="border-t border-stone-100 pt-5 flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-[0.25em] font-bold text-stone-950">
                    Grand Total
                  </span>
                  <span className="font-serif text-2xl text-stone-950 font-semibold">
                    ${subtotal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}