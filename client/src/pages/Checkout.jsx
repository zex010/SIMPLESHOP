
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

const API_HOST = "https://avernus-api.onrender.com";

const FALLBACK_IMAGE =
  "https://placehold.co/200x200/f5f5f4/78716c?text=No+Image";

const resolveImage = (image) => {
  const src = Array.isArray(image) ? image[0] : image;

  if (!src) return FALLBACK_IMAGE;

  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  return `${API_HOST}/${String(src).replace(/^\/+/, "")}`;
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

  const { cart, placeOrder } = useShop();

  const isLoggedIn = Boolean(
    localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token")
  );

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("Cash On Delivery");
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
    (acc, item) =>
      acc +
      Number(item.price || 0) *
        Number(item.qty || 1),
    0
  );

  const totalItems = (cart || []).reduce(
    (total, item) =>
      total + Number(item.qty || 0),
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (apiError) {
      setApiError("");
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Street address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.province.trim()) {
      newErrors.province = "Province / State is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToReview = (e) => {
    e.preventDefault();

    setApiError("");

    if (validateStep1()) {
      setStep(2);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      setApiError(
        "Please fill in all required shipping fields before continuing."
      );
    }
  };

  const handleContinueToPayment = () => {
    setApiError("");
    setStep(3);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();

    setApiError("");

    const itemsMissingSize = cart.filter(
      (item) => !item.selectedSize
    );

    if (itemsMissingSize.length > 0) {
      const names = itemsMissingSize
        .map((item) => item.name)
        .join(", ");

      setApiError(
        `No size selected for: ${names}. Please return to your cart, remove and re-add the item with a size, then try again.`
      );

      return;
    }

    setLoading(true);

    const orderItems = cart.map((item) => ({
      product: item._id,
      name: item.name,
      image: item.image,
      selectedSize: item.selectedSize,
      qty: item.qty,
      price: item.price,
    }));

    const orderPayload = {
      orderItems,
      shippingAddress: formData,
      totalPrice: subtotal,
      paymentMethod,
    };

    try {
      const result = await placeOrder(orderPayload);

      setOrderResult(result?.order || null);
      setLoading(false);
      setStep(4);

      setTimeout(() => {
        navigate("/my-orders");
      }, 2500);
    } catch (err) {
      console.error("Failed to place order:", err);

      setLoading(false);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Unable to process order. Please check your connection.";

      setApiError(errorMessage);
    }
  };

  // Compact input styling
  const inputClass = (error) =>
    `w-full px-3 py-2 bg-stone-50/50 border rounded-md text-xs text-stone-950 placeholder:text-[10px] placeholder:text-stone-400 focus:bg-white focus:outline-none transition-all ${
      error
        ? "border-rose-400"
        : "border-stone-200 focus:border-stone-950"
    }`;

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="text-center mb-9 sm:mb-11">

          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[0.2em] sm:tracking-[0.25em] text-stone-950 uppercase font-light">
            AVERNUS
          </h1>

          {cart &&
            cart.length > 0 &&
            isLoggedIn &&
            step < 4 && (
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-x-2
                  gap-y-2
                  sm:gap-x-4
                  mt-6
                  text-[8px]
                  sm:text-[9px]
                  md:text-[10px]
                  uppercase
                  tracking-[0.16em]
                  sm:tracking-[0.2em]
                  text-stone-400
                "
              >
                <span
                  onClick={() => setStep(1)}
                  className={`cursor-pointer ${
                    step === 1
                      ? "text-stone-950 font-semibold"
                      : "hover:text-stone-700"
                  }`}
                >
                  01. Shipping
                </span>

                <span className="w-4 sm:w-6 h-px bg-stone-200" />

                <span
                  onClick={() =>
                    step > 2 && setStep(2)
                  }
                  className={`${
                    step === 2
                      ? "text-stone-950 font-semibold"
                      : step > 2
                      ? "cursor-pointer hover:text-stone-700"
                      : ""
                  }`}
                >
                  02. Review
                </span>

                <span className="w-4 sm:w-6 h-px bg-stone-200" />

                <span
                  className={
                    step === 3
                      ? "text-stone-950 font-semibold"
                      : ""
                  }
                >
                  03. Payment
                </span>
              </div>
            )}

          <div className="w-12 sm:w-16 h-px bg-stone-200 mx-auto mt-5" />
        </div>

        {/* =====================================================
            LOGIN REQUIRED
        ===================================================== */}

        {!isLoggedIn && step < 4 ? (
          <div
            className="
              w-full
              max-w-sm
              mx-auto
              py-10
              sm:py-12
              px-5
              sm:px-7
              text-center
              bg-white
              border
              border-stone-100
              rounded-xl
              shadow-sm
            "
          >
            <div
              className="
                w-14
                h-14
                sm:w-16
                sm:h-16
                bg-stone-50
                rounded-full
                flex
                items-center
                justify-center
                mx-auto
                mb-5
                border
                border-stone-100
              "
            >
              <Lock
                size={23}
                className="text-stone-400"
                strokeWidth={1.3}
              />
            </div>

            <h2
              className="
                font-serif
                text-xl
                sm:text-2xl
                tracking-[0.1em]
                sm:tracking-[0.14em]
                uppercase
                text-stone-950
                mb-3
              "
            >
              Please Log In
            </h2>

            <p
              className="
                text-[10px]
                sm:text-[11px]
                uppercase
                tracking-[0.12em]
                sm:tracking-[0.16em]
                text-stone-500
                mb-6
                leading-6
                font-light
              "
            >
              An AVERNUS account is required
              to complete checkout.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/signin", {
                  state: {
                    from: "/checkout",
                  },
                })
              }
              className="
                w-auto
                min-w-[170px]
                px-6
                py-3
                bg-stone-950
                text-white
                text-[9px]
                sm:text-[10px]
                uppercase
                tracking-[0.18em]
                font-medium
                rounded-md
                hover:bg-stone-800
                transition-all
                cursor-pointer
              "
            >
              Log In To Continue
            </button>
          </div>
        ) : /* =====================================================
             EMPTY CART
        ===================================================== */

        (!cart || cart.length === 0) &&
          step < 4 ? (
          <div
            className="
              max-w-sm
              mx-auto
              py-12
              px-6
              text-center
              bg-white
              border
              border-stone-100
              rounded-xl
              shadow-sm
            "
          >
            <div
              className="
                w-14
                h-14
                bg-stone-50
                rounded-full
                flex
                items-center
                justify-center
                mx-auto
                mb-5
              "
            >
              <ShoppingBag
                size={25}
                className="text-stone-400"
                strokeWidth={1.2}
              />
            </div>

            <h2
              className="
                font-serif
                text-xl
                sm:text-2xl
                tracking-[0.1em]
                uppercase
                text-stone-950
                mb-3
              "
            >
              Your Bag Is Empty
            </h2>

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.15em]
                text-stone-500
                mb-6
                leading-6
              "
            >
              Explore our signature collections
              before proceeding to checkout.
            </p>

            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="
                w-auto
                px-7
                py-3
                bg-stone-950
                text-white
                text-[9px]
                uppercase
                tracking-[0.2em]
                font-medium
                rounded-md
                hover:bg-stone-800
                transition-all
              "
            >
              Return to Cart
            </button>
          </div>
        ) : /* =====================================================
             SUCCESS
        ===================================================== */

        step === 4 ? (
          <div
            className="
              w-full
              max-w-lg
              mx-auto
              bg-white
              p-6
              sm:p-10
              rounded-xl
              border
              border-stone-100
              shadow-sm
              text-center
            "
          >
            <div
              className="
                w-16
                h-16
                bg-emerald-50
                rounded-full
                flex
                items-center
                justify-center
                mx-auto
                border
                border-emerald-100
                mb-5
              "
            >
              <CheckCircle
                size={32}
                className="text-emerald-600"
                strokeWidth={1.5}
              />
            </div>

            <h2
              className="
                font-serif
                text-2xl
                sm:text-3xl
                tracking-[0.08em]
                sm:tracking-[0.12em]
                uppercase
                text-stone-950
              "
            >
              Order Booked Successfully
            </h2>

            <p
              className="
                text-[10px]
                sm:text-xs
                uppercase
                tracking-[0.18em]
                text-stone-500
                mt-3
              "
            >
              Thank you for choosing AVERNUS.
            </p>

            <div
              className="
                mt-7
                bg-stone-50/60
                border
                border-stone-100
                rounded-lg
                p-5
                text-left
                space-y-3
              "
            >
              <div className="flex justify-between gap-4 text-[10px] uppercase tracking-[0.15em]">
                <span className="text-stone-400">
                  Order ID
                </span>

                <span className="font-mono">
                  #
                  {(orderResult?._id || "")
                    .slice(-8)
                    .toUpperCase() || "—"}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-[10px] uppercase tracking-[0.15em]">
                <span className="text-stone-400">
                  Order Date
                </span>

                <span>
                  {orderResult?.createdAt
                    ? new Date(
                        orderResult.createdAt
                      ).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : new Date().toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-[10px] uppercase tracking-[0.15em]">
                <span className="text-stone-400">
                  Payment
                </span>

                <span>
                  {orderResult?.paymentMethod ||
                    paymentMethod}
                </span>
              </div>

              <div className="border-t border-stone-100 pt-3 flex justify-between">
                <span className="text-[10px] uppercase tracking-[0.18em] font-bold">
                  Total
                </span>

                <span className="font-serif text-lg">
                  $
                  {orderResult?.totalPrice ??
                    subtotal}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-stone-400 text-[9px] uppercase tracking-[0.15em]">
              <Loader2
                size={14}
                className="animate-spin"
              />
              Redirecting...
            </div>
          </div>
        ) : (
          /* =====================================================
             CHECKOUT CONTENT
          ===================================================== */

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-6
              xl:gap-10
              items-start
            "
          >

            {/* =================================================
                LEFT — FORM
            ================================================= */}

            <div className="w-full">

              {/* =================================================
                  STEP 1 — SHIPPING
              ================================================= */}

              {step === 1 && (
                <div
                  className="
                    bg-white
                    p-4
                    sm:p-5
                    md:p-6
                    rounded-xl
                    border
                    border-stone-100
                    shadow-sm
                  "
                >

                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      gap-2
                      border-b
                      border-stone-100
                      pb-3
                      mb-4
                    "
                  >
                    <h2
                      className="
                        font-serif
                        text-lg
                        sm:text-xl
                        tracking-[0.08em]
                        sm:tracking-[0.1em]
                        uppercase
                      "
                    >
                      Shipping Information
                    </h2>

                    <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.1em] text-stone-400">
                      <Lock size={12} />
                      <span>
                        Secure Checkout
                      </span>
                    </div>
                  </div>

                  {apiError && (
                    <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-[10px] rounded-md flex items-start gap-2">
                      <AlertCircle
                        size={14}
                        className="shrink-0 text-rose-600"
                      />

                      <span>{apiError}</span>
                    </div>
                  )}

                  <form
                    onSubmit={handleContinueToReview}
                    className="space-y-3.5"
                  >

                    {/* NAME */}

                    <div>
                      <label className="block text-[8px] uppercase tracking-[0.18em] font-semibold text-stone-600 mb-1">
                        Full Name *
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full name"
                        className={inputClass(
                          errors.name
                        )}
                      />

                      {errors.name && (
                        <p className="text-rose-500 text-[9px] mt-0.5">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* EMAIL + PHONE */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                      <div>
                        <label className="block text-[8px] uppercase tracking-[0.18em] font-semibold text-stone-600 mb-1">
                          Email *
                        </label>

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email address"
                          className={inputClass(
                            errors.email
                          )}
                        />

                        {errors.email && (
                          <p className="text-rose-500 text-[9px] mt-0.5">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[8px] uppercase tracking-[0.18em] font-semibold text-stone-600 mb-1">
                          Phone *
                        </label>

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+92 300 0000000"
                          className={inputClass(
                            errors.phone
                          )}
                        />

                        {errors.phone && (
                          <p className="text-rose-500 text-[9px] mt-0.5">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* ADDRESS */}

                    <div>
                      <label className="block text-[8px] uppercase tracking-[0.18em] font-semibold text-stone-600 mb-1">
                        Street Address *
                      </label>

                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House number, street or building"
                        className={inputClass(
                          errors.address
                        )}
                      />

                      {errors.address && (
                        <p className="text-rose-500 text-[9px] mt-0.5">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    {/* CITY + PROVINCE */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                      <div>
                        <label className="block text-[8px] uppercase tracking-[0.18em] font-semibold text-stone-600 mb-1">
                          City *
                        </label>

                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          className={inputClass(
                            errors.city
                          )}
                        />

                        {errors.city && (
                          <p className="text-rose-500 text-[9px] mt-0.5">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[8px] uppercase tracking-[0.18em] font-semibold text-stone-600 mb-1">
                          Province *
                        </label>

                        <input
                          type="text"
                          name="province"
                          value={formData.province}
                          onChange={handleInputChange}
                          placeholder="Province / State"
                          className={inputClass(
                            errors.province
                          )}
                        />

                        {errors.province && (
                          <p className="text-rose-500 text-[9px] mt-0.5">
                            {errors.province}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* POSTAL + COUNTRY */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                      <div>
                        <label className="block text-[8px] uppercase tracking-[0.18em] font-semibold text-stone-600 mb-1">
                          Postal Code
                        </label>

                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="Postal code"
                          className="
                            w-full
                            px-3
                            py-2
                            bg-stone-50/50
                            border
                            border-stone-200
                            rounded-md
                            text-xs
                            text-stone-950
                            placeholder:text-[10px]
                            placeholder:text-stone-400
                            focus:bg-white
                            focus:border-stone-950
                            focus:outline-none
                            transition-all
                          "
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] uppercase tracking-[0.18em] font-semibold text-stone-600 mb-1">
                          Country *
                        </label>

                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder="Country"
                          className={inputClass(
                            errors.country
                          )}
                        />

                        {errors.country && (
                          <p className="text-rose-500 text-[9px] mt-0.5">
                            {errors.country}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* CONTINUE BUTTON */}

                    <button
                      type="submit"
                      className="
                        w-full
                        py-2.5
                        mt-1
                        bg-stone-950
                        text-white
                        text-[9px]
                        uppercase
                        tracking-[0.18em]
                        rounded-md
                        hover:bg-stone-800
                        transition
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      Continue
                      <ArrowRight size={13} />
                    </button>

                  </form>
                </div>
              )}

              {/* =================================================
                  STEP 2
              ================================================= */}

              {step === 2 && (
                <div
                  className="
                    bg-white
                    p-5
                    sm:p-7
                    md:p-8
                    rounded-xl
                    border
                    border-stone-100
                    shadow-sm
                  "
                >
                  <div className="border-b border-stone-100 pb-5 mb-6">
                    <h2
                      className="
                        font-serif
                        text-xl
                        sm:text-2xl
                        tracking-[0.08em]
                        uppercase
                      "
                    >
                      Review Your Order
                    </h2>
                  </div>

                  {apiError && (
                    <div className="p-3 mb-5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex gap-2">
                      <AlertCircle
                        size={15}
                        className="shrink-0"
                      />

                      <span>{apiError}</span>
                    </div>
                  )}

                  <div className="bg-stone-50 border border-stone-100 rounded-lg p-5 space-y-2">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">
                      Shipping Destination
                    </h3>

                    <p className="text-sm font-medium">
                      {formData.name}
                    </p>

                    <p className="text-xs text-stone-600 leading-6">
                      {formData.address},{" "}
                      {formData.city},{" "}
                      {formData.province}
                    </p>

                    <p className="text-xs text-stone-600">
                      {formData.postalCode},{" "}
                      {formData.country}
                    </p>

                    <p className="text-xs text-stone-600 pt-1 break-words">
                      {formData.email} ·{" "}
                      {formData.phone}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row gap-3">

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="
                        w-full
                        sm:w-1/3
                        py-3
                        border
                        border-stone-200
                        text-[9px]
                        uppercase
                        tracking-[0.15em]
                        rounded-md
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      <ArrowLeft size={14} />
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={handleContinueToPayment}
                      className="
                        w-full
                        sm:flex-1
                        py-3
                        bg-stone-950
                        text-white
                        text-[9px]
                        uppercase
                        tracking-[0.18em]
                        rounded-md
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      Continue To Payment
                      <ArrowRight size={14} />
                    </button>

                  </div>
                </div>
              )}

              {/* =================================================
                  STEP 3
              ================================================= */}

              {step === 3 && (
                <div
                  className="
                    bg-white
                    p-5
                    sm:p-7
                    md:p-8
                    rounded-xl
                    border
                    border-stone-100
                    shadow-sm
                  "
                >
                  <div className="border-b border-stone-100 pb-5 mb-6">
                    <h2
                      className="
                        font-serif
                        text-xl
                        sm:text-2xl
                        tracking-[0.08em]
                        uppercase
                      "
                    >
                      Select Payment Method
                    </h2>
                  </div>

                  {apiError && (
                    <div className="p-3 mb-5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex gap-2">
                      <AlertCircle
                        size={15}
                        className="shrink-0"
                      />

                      <span>{apiError}</span>
                    </div>
                  )}

                  <div className="space-y-3">

                    {PAYMENT_METHODS.map(
                      ({
                        id,
                        label,
                        description,
                        icon: Icon,
                        disabled,
                      }) => {
                        const selected =
                          paymentMethod === id;

                        return (
                          <button
                            key={id}
                            type="button"
                            disabled={disabled}
                            onClick={() =>
                              setPaymentMethod(id)
                            }
                            className={`
                              w-full
                              flex
                              items-center
                              gap-3
                              p-4
                              rounded-lg
                              border
                              text-left
                              transition
                              ${
                                disabled
                                  ? "border-stone-100 bg-stone-50 opacity-50 cursor-not-allowed"
                                  : selected
                                  ? "border-stone-950 bg-stone-50"
                                  : "border-stone-200 hover:border-stone-400"
                              }
                            `}
                          >
                            <div className="h-9 w-9 rounded-full bg-white border border-stone-200 flex items-center justify-center shrink-0">
                              <Icon
                                size={16}
                                strokeWidth={1.5}
                              />
                            </div>

                            <div className="flex-grow min-w-0">
                              <p className="text-xs font-medium text-stone-950 flex flex-wrap items-center gap-2">
                                {label}

                                {disabled && (
                                  <span className="text-[8px] uppercase tracking-wider text-stone-400 border border-stone-200 rounded-full px-2 py-0.5">
                                    Coming Soon
                                  </span>
                                )}
                              </p>

                              <p className="text-[10px] text-stone-500 mt-1 leading-5">
                                {description}
                              </p>
                            </div>

                            {!disabled && (
                              <div
                                className={`
                                  h-5
                                  w-5
                                  rounded-full
                                  border
                                  flex
                                  items-center
                                  justify-center
                                  shrink-0
                                  ${
                                    selected
                                      ? "bg-stone-950 border-stone-950"
                                      : "border-stone-300"
                                  }
                                `}
                              >
                                {selected && (
                                  <Check
                                    size={12}
                                    className="text-white"
                                  />
                                )}
                              </div>
                            )}
                          </button>
                        );
                      }
                    )}

                  </div>

                  <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row gap-3">

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={loading}
                      className="
                        w-full
                        sm:w-1/3
                        py-3
                        border
                        border-stone-200
                        text-[9px]
                        uppercase
                        tracking-[0.15em]
                        rounded-md
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      <ArrowLeft size={14} />
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="
                        w-full
                        sm:flex-1
                        py-3
                        bg-stone-950
                        text-white
                        text-[9px]
                        uppercase
                        tracking-[0.16em]
                        rounded-md
                        flex
                        items-center
                        justify-center
                        gap-2
                        disabled:bg-stone-400
                      "
                    >
                      {loading ? (
                        <>
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                          Processing...
                        </>
                      ) : (
                        <>
                          Confirm Order · $
                          {subtotal}
                        </>
                      )}
                    </button>

                  </div>
                </div>
              )}

              <div
                className="
                  mt-6
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-stone-400
                  text-[8px]
                  sm:text-[9px]
                  tracking-[0.12em]
                  uppercase
                "
              >
                <ShieldCheck size={14} />
                <span>
                  Complimentary Express Shipping & Returns
                </span>
              </div>

            </div>

            {/* =================================================
                RIGHT — ORDER SUMMARY
            ================================================= */}

            <div className="w-full lg:sticky lg:top-24">

              <div
                className="
                  bg-white
                  p-5
                  sm:p-7
                  rounded-xl
                  border
                  border-stone-100
                  shadow-sm
                "
              >

                <div className="flex items-center justify-between border-b border-stone-100 pb-4">

                  <h2
                    className="
                      font-serif
                      text-lg
                      sm:text-xl
                      tracking-[0.08em]
                      uppercase
                    "
                  >
                    Order Summary
                  </h2>

                  <span className="text-[9px] uppercase tracking-wider text-stone-400">
                    {totalItems} Items
                  </span>

                </div>

                {/* PRODUCT LIST */}

                <div
                  className="
                    divide-y
                    divide-stone-100
                    max-h-[360px]
                    overflow-y-auto
                  "
                >

                  {(cart || []).map((item) => (
                    <div
                      key={`${item._id}-${item.selectedSize}`}
                      className="
                        py-4
                        flex
                        gap-3
                        items-center
                      "
                    >

                      <div
                        className="
                          w-14
                          h-14
                          sm:w-16
                          sm:h-16
                          bg-stone-50
                          rounded-lg
                          p-2
                          shrink-0
                          border
                          border-stone-100
                        "
                      >
                        <img
                          src={resolveImage(item.image)}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              FALLBACK_IMAGE;
                          }}
                        />
                      </div>

                      <div className="flex-grow min-w-0">

                        <p
                          className="
                            text-[8px]
                            uppercase
                            tracking-[0.2em]
                            text-stone-400
                          "
                        >
                          {item.brand || "AVERNUS"}
                        </p>

                        <h3
                          className="
                            font-serif
                            text-sm
                            sm:text-base
                            text-stone-950
                            break-words
                            leading-tight
                          "
                        >
                          {item.name}
                        </h3>

                        <p
                          className="
                            text-[9px]
                            uppercase
                            tracking-[0.1em]
                            text-stone-500
                            mt-1
                          "
                        >
                          Size: {item.selectedSize} · Qty: {item.qty}
                        </p>

                      </div>

                      <div className="text-right shrink-0">

                        <p className="font-serif text-sm font-medium">
                          $
                          {Number(item.price) *
                            Number(item.qty)}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>

                {/* COST */}

                <div
                  className="
                    border-t
                    border-stone-100
                    pt-5
                    mt-2
                    space-y-3
                    text-[10px]
                    uppercase
                    tracking-[0.13em]
                    text-stone-600
                  "
                >

                  <div className="flex justify-between">
                    <span>Subtotal</span>

                    <span className="font-medium text-stone-900">
                      ${subtotal}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>

                    <span className="text-emerald-700 font-semibold">
                      Complimentary
                    </span>
                  </div>

                </div>

                {/* TOTAL */}

                <div
                  className="
                    border-t
                    border-stone-100
                    pt-5
                    mt-5
                    flex
                    justify-between
                    items-center
                  "
                >
                  <span
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.2em]
                      font-bold
                    "
                  >
                    Grand Total
                  </span>

                  <span
                    className="
                      font-serif
                      text-xl
                      sm:text-2xl
                      font-semibold
                    "
                  >
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

