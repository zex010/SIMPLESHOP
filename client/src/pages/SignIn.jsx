import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import perfumesImage from "../assets/perfumes.jpg";

// ============================================================
// API
// ============================================================

const API_BASE_URL = "https://avernus-api.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// COMPONENT
// ============================================================

export default function SignIn() {
  const navigate = useNavigate();

  // ============================================================
  // STATE
  // ============================================================

  const [activeTab, setActiveTab] = useState("signin");

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] =
    useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [serverError, setServerError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });

  const [forgotEmail, setForgotEmail] = useState("");

  const [errors, setErrors] = useState({});

  // ============================================================
  // TOAST
  // ============================================================

  const showToastNotification = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "success",
      });
    }, 4000);
  };

  // ============================================================
  // CLEAR ERRORS
  // ============================================================

  useEffect(() => {
    setErrors({});
    setServerError("");
  }, [activeTab]);

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (serverError) {
      setServerError("");
    }
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters.";
    }

    if (activeTab === "signup") {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required.";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required.";
      }

      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required.";
      }

      if (!formData.address.trim()) {
        newErrors.address = "Address is required.";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword =
          "Please confirm your password.";
      } else if (
        formData.password !== formData.confirmPassword
      ) {
        newErrors.confirmPassword =
          "Passwords do not match.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // SIGN IN
  // ============================================================

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setServerError("");

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token } = response.data;

      if (formData.rememberMe) {
        localStorage.setItem("auth_token", token);
        sessionStorage.removeItem("auth_token");
      } else {
        sessionStorage.setItem("auth_token", token);
        localStorage.removeItem("auth_token");
      }

      showToastNotification(
        "Welcome back. Redirecting...",
        "success"
      );

      setTimeout(() => {
        navigate("/home");
      }, 1200);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Invalid credentials or server unavailable.";

      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // SIGN UP
  // ============================================================

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setServerError("");

    try {
      await api.post("/auth/register", {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        password: formData.password,
      });

      const registeredEmail = formData.email;

      showToastNotification(
        "Account created successfully. Please sign in.",
        "success"
      );

      setFormData({
        firstName: "",
        lastName: "",
        email: registeredEmail,
        phoneNumber: "",
        address: "",
        password: "",
        confirmPassword: "",
        rememberMe: false,
      });

      setActiveTab("signin");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Email may already be in use.";

      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // FORGOT PASSWORD
  // ============================================================

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (
      !forgotEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)
    ) {
      showToastNotification(
        "Please enter a valid email address.",
        "error"
      );
      return;
    }

    setIsModalLoading(true);

    try {
      await api.post("/auth/forgot-password", {
        email: forgotEmail,
      });

      showToastNotification(
        "Password reset instructions sent to your email.",
        "success"
      );

      setIsForgotPasswordOpen(false);
      setForgotEmail("");
    } catch (err) {
      showToastNotification(
        err.response?.data?.message ||
          "Failed to send reset email.",
        "error"
      );
    } finally {
      setIsModalLoading(false);
    }
  };

  // ============================================================
  // BACK
  // ============================================================

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/home");
    }
  };

  // ============================================================
  // TAB SWITCH
  // ============================================================

  const switchToSignIn = () => {
    setActiveTab("signin");
    setErrors({});
    setServerError("");
  };

  const switchToSignUp = () => {
    setActiveTab("signup");
    setErrors({});
    setServerError("");
  };

  // ============================================================
  // SHARED INPUT CLASS
  // ============================================================

  const inputClass = (error) =>
    `w-full px-0 py-2.5 text-xs bg-transparent border-b ${
      error
        ? "border-red-500"
        : "border-stone-300 focus:border-black"
    } outline-none transition-colors placeholder:text-[10px] placeholder:text-stone-300 font-light`;

  // ============================================================
  // TAB COMPONENT
  // ============================================================

  const Tabs = () => (
    <div className="flex border-b border-stone-200">
      <button
        type="button"
        onClick={switchToSignIn}
        className={`flex-1 pb-3 text-[10px] tracking-[0.16em] uppercase transition-colors relative font-medium ${
          activeTab === "signin"
            ? "text-black font-semibold"
            : "text-stone-400 hover:text-stone-600"
        }`}
      >
        Sign In

        {activeTab === "signin" && (
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black" />
        )}
      </button>

      <button
        type="button"
        onClick={switchToSignUp}
        className={`flex-1 pb-3 text-[10px] tracking-[0.16em] uppercase transition-colors relative font-medium ${
          activeTab === "signup"
            ? "text-black font-semibold"
            : "text-stone-400 hover:text-stone-600"
        }`}
      >
        Create Account

        {activeTab === "signup" && (
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black" />
        )}
      </button>
    </div>
  );

  // ============================================================
  // SIGN IN FORM
  // ============================================================

  const SignInForm = ({ mobile = false }) => (
    <form
      onSubmit={handleSignInSubmit}
      className="space-y-4.5 mt-5"
      noValidate
    >
      <div className="space-y-1.5">
        <label
          htmlFor={mobile ? "mobile-signin-email" : "signin-email"}
          className="block text-[10px] uppercase tracking-[0.13em] text-stone-600 font-medium"
        >
          Email Address
        </label>

        <input
          id={mobile ? "mobile-signin-email" : "signin-email"}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="client@avernus.com"
          className={inputClass(errors.email)}
        />

        {errors.email && (
          <p className="text-[10px] text-red-600 tracking-wide">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label
            htmlFor={
              mobile
                ? "mobile-signin-password"
                : "signin-password"
            }
            className="block text-[10px] uppercase tracking-[0.13em] text-stone-600 font-medium"
          >
            Password
          </label>

          <button
            type="button"
            onClick={() => setIsForgotPasswordOpen(true)}
            className="text-[9px] uppercase tracking-[0.08em] text-stone-500 hover:text-black transition-colors underline underline-offset-3"
          >
            Forgot Password?
          </button>
        </div>

        <div className="relative">
          <input
            id={
              mobile
                ? "mobile-signin-password"
                : "signin-password"
            }
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            className={`${inputClass(errors.password)} pr-9`}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black p-1"
          >
            {showPassword ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="text-[10px] text-red-600 tracking-wide">
            {errors.password}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2.5 pt-1">
        <input
          id={mobile ? "mobile-rememberMe" : "rememberMe"}
          type="checkbox"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleInputChange}
          className="h-3.5 w-3.5 rounded-none border-stone-300 accent-black cursor-pointer"
        />

        <label
          htmlFor={mobile ? "mobile-rememberMe" : "rememberMe"}
          className="text-[10px] text-stone-600 tracking-wide cursor-pointer"
        >
          Remember me for future visits
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-black text-white text-[10px] uppercase tracking-[0.22em] font-medium border border-black hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-3"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-3 h-3 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </button>

      {!mobile && (
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>

          <span className="relative bg-white px-3 text-[9px] uppercase tracking-[0.18em] text-stone-400">
            OR
          </span>
        </div>
      )}

      <button
        type="button"
        disabled
        className="w-full py-3 bg-stone-100 text-stone-400 text-[9px] uppercase tracking-[0.16em] font-medium border border-stone-200 cursor-not-allowed"
      >
        Google Sign-In coming soon
      </button>

      <div className="text-center pt-2">
        <p className="text-[10px] text-stone-500 tracking-wide">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={switchToSignUp}
            className="text-black font-medium underline underline-offset-3 hover:opacity-70 transition-opacity"
          >
            Create Account
          </button>
        </p>
      </div>
    </form>
  );

  // ============================================================
  // SIGN UP FORM
  // ============================================================

  const SignUpForm = () => (
    <form
      onSubmit={handleSignUpSubmit}
      className="space-y-3.5 mt-5"
      noValidate
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-[10px] uppercase tracking-[0.13em] text-stone-600 font-medium">
            First Name
          </label>

          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Henri"
            className={inputClass(errors.firstName)}
          />

          {errors.firstName && (
            <p className="text-[9px] text-red-600">
              {errors.firstName}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] uppercase tracking-[0.13em] text-stone-600 font-medium">
            Last Name
          </label>

          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="D'Orsay"
            className={inputClass(errors.lastName)}
          />

          {errors.lastName && (
            <p className="text-[9px] text-red-600">
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[10px] uppercase tracking-[0.13em] text-stone-600 font-medium">
          Email Address
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="client@avernus.com"
          className={inputClass(errors.email)}
        />

        {errors.email && (
          <p className="text-[9px] text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-[10px] uppercase tracking-[0.13em] text-stone-600 font-medium">
          Phone Number
        </label>

        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="+1 555 019 2834"
          className={inputClass(errors.phoneNumber)}
        />

        {errors.phoneNumber && (
          <p className="text-[9px] text-red-600">
            {errors.phoneNumber}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-[10px] uppercase tracking-[0.13em] text-stone-600 font-medium">
          Shipping Address
        </label>

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="12 Place Vendôme, Paris"
          className={inputClass(errors.address)}
        />

        {errors.address && (
          <p className="text-[9px] text-red-600">
            {errors.address}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-[10px] uppercase tracking-[0.13em] text-stone-600 font-medium">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="At least 8 characters"
            className={`${inputClass(errors.password)} pr-9`}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black p-1"
          >
            {showPassword ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="text-[9px] text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-[10px] uppercase tracking-[0.13em] text-stone-600 font-medium">
          Confirm Password
        </label>

        <div className="relative">
          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Re-enter password"
            className={`${inputClass(
              errors.confirmPassword
            )} pr-9`}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword((prev) => !prev)
            }
            className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black p-1"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="text-[9px] text-red-600">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-black text-white text-[10px] uppercase tracking-[0.22em] font-medium border border-black hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-3 h-3 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>

      <div className="text-center pt-2 pb-4">
        <p className="text-[10px] text-stone-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={switchToSignIn}
            className="text-black font-medium underline underline-offset-3"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div className="min-h-screen w-full bg-white text-stone-900 font-sans antialiased overflow-hidden">

      {/* ======================================================
          TOAST
      ====================================================== */}

      {toast.show && (
        <div
          role="alert"
          className={`fixed top-5 right-5 z-[500] flex items-center gap-2.5 px-4 py-3 border shadow-sm ${
            toast.type === "success"
              ? "bg-stone-950 text-white border-stone-800"
              : "bg-red-50 text-red-900 border-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          )}

          <span className="text-[10px] uppercase tracking-[0.15em] font-medium">
            {toast.message}
          </span>
        </div>
      )}

      {/* ======================================================
          DESKTOP
      ====================================================== */}

      <div className="relative min-h-screen w-full">

        {/* DESKTOP IMAGE */}

        <div
          className={`
            absolute top-0 left-0 w-1/2 h-full
            hidden md:flex flex-col items-center justify-between
            p-6 md:p-10 overflow-hidden bg-stone-950
            transition-transform duration-700
            ease-[cubic-bezier(0.77,0,0.175,1)]
            ${
              activeTab === "signup"
                ? "translate-x-full"
                : "translate-x-0"
            }
          `}
        >
          <img
            src={perfumesImage}
            alt="AVERNUS Perfume Bottle"
            className="absolute inset-0 w-full h-full object-cover object-bottom scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/30 to-stone-950/70" />

          <div className="relative z-10 w-full text-center pt-2 md:pt-5" />

          <div className="relative z-10 text-center max-w-lg mx-auto flex flex-col items-center my-auto transform -translate-y-8 md:-translate-y-14">
            <div
              onClick={() => navigate("/home")}
              className="cursor-pointer transition-opacity hover:opacity-80"
            >
              <BrandLogo variant="splash" />
            </div>

            <div className="w-7 h-[1px] bg-white/40 my-4" />

            <p className="text-[11px] md:text-xs tracking-[0.22em] text-stone-200 font-light italic">
              "Crafted for timeless elegance."
            </p>
          </div>

          <div className="relative z-10 w-full text-center md:text-left text-[8px] uppercase tracking-[0.25em] text-stone-400 font-mono">
            Est. Paris &bull; London &bull; New York
          </div>
        </div>

        {/* DESKTOP AUTH */}

        <div
          className={`
            absolute top-0 left-0 w-1/2 h-full
            hidden md:flex items-center justify-center
            px-12 py-10 bg-white
            transition-transform duration-700
            ease-[cubic-bezier(0.77,0,0.175,1)]
            ${
              activeTab === "signup"
                ? "translate-x-0"
                : "translate-x-full"
            }
          `}
        >
          <div className="w-full max-w-sm mx-auto space-y-6">

            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="inline-flex items-center justify-center text-stone-500 hover:text-black transition-colors p-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            <Tabs />

            {serverError && (
              <div className="mt-4 p-3 bg-stone-50 border border-stone-300 flex items-start gap-2.5">
                <AlertCircle className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />

                <p className="text-[10px] text-stone-800 tracking-wide leading-relaxed">
                  {serverError}
                </p>
              </div>
            )}

            {activeTab === "signin" ? (
              <SignInForm />
            ) : (
              <SignUpForm />
            )}
          </div>
        </div>

        {/* ====================================================
            MOBILE
            IMPORTANT:
            IMAGE HAS z-10
            FORM HAS z-30
            FORM ALWAYS STAYS ABOVE IMAGE
        ==================================================== */}

        <div className="md:hidden relative min-h-screen w-full overflow-hidden bg-white">

          {/* ==================================================
              MOBILE IMAGE
              ================================================== */}

          <div
            className={`
              absolute left-0 top-0
              z-10
              w-full h-[320px]
              bg-stone-950
              overflow-hidden
              transition-transform duration-700
              ease-[cubic-bezier(0.77,0,0.175,1)]
              pointer-events-none
              ${
                activeTab === "signup"
                  ? "translate-y-[calc(100vh-320px)]"
                  : "translate-y-0"
              }
            `}
          >
            <img
              src={perfumesImage}
              alt="AVERNUS Perfume Bottle"
              className="absolute inset-0 w-full h-full object-cover object-bottom scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/30 to-stone-950/70" />

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-between p-6">
              <span className="text-[9px] uppercase tracking-[0.35em] text-stone-300 font-mono pt-2">
                Haute Parfumerie
              </span>

              <div className="text-center flex flex-col items-center -translate-y-3">
                <div
                  onClick={() => navigate("/home")}
                  className="cursor-pointer pointer-events-auto"
                >
                  <BrandLogo variant="splash" />
                </div>

                <div className="w-7 h-[1px] bg-white/40 my-4" />

                <p className="text-[11px] tracking-[0.22em] text-stone-200 font-light italic">
                  "Crafted for timeless elegance."
                </p>
              </div>

              <div className="w-full text-center text-[8px] uppercase tracking-[0.25em] text-stone-400 font-mono">
                Est. Paris &bull; London &bull; New York
              </div>
            </div>
          </div>

          {/* ==================================================
              MOBILE FORM
              
              KEY FIX:
              z-30 means the white form is ALWAYS ABOVE
              the image.

              When signup is selected, this becomes a
              full-screen white layer and the image moves
              underneath it.

              overflow-y-auto allows password/confirm/button
              to scroll normally on small phones.
          ================================================== */}

          <div
            className={`
              absolute inset-0
              z-30
              w-full
              min-h-screen
              bg-white
              overflow-x-hidden
              overflow-y-auto
              overscroll-contain
              transition-transform duration-700
              ease-[cubic-bezier(0.77,0,0.175,1)]
              ${
                activeTab === "signup"
                  ? "translate-y-0"
                  : "translate-y-[320px]"
              }
            `}
          >
            <div
              className="
                w-full
                max-w-sm
                mx-auto
                px-5
                pt-8
                pb-12
                bg-white
                min-h-full
                relative
                z-40
              "
            >

              {/* BACK */}

              <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                className="inline-flex items-center justify-center text-stone-500 hover:text-black transition-colors p-1 mb-6"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              {/* TABS */}

              <Tabs />

              {/* SERVER ERROR */}

              {serverError && (
                <div className="mt-4 p-3 bg-stone-50 border border-stone-300 flex items-start gap-2.5">
                  <AlertCircle className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />

                  <p className="text-[10px] text-stone-800 tracking-wide leading-relaxed">
                    {serverError}
                  </p>
                </div>
              )}

              {/* FORMS */}

              {activeTab === "signin" ? (
                <SignInForm mobile />
              ) : (
                <SignUpForm />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          FORGOT PASSWORD MODAL
      ====================================================== */}

      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-[600] bg-black/50 backdrop-blur-sm flex items-center justify-center px-5">
          <div className="w-full max-w-sm bg-white p-7 shadow-2xl">

            <div className="mb-6">
              <p className="text-[9px] uppercase tracking-[0.3em] text-stone-400 mb-3">
                AVERNUS
              </p>

              <h2 className="font-serif text-2xl font-normal">
                Reset Password
              </h2>

              <p className="mt-2 text-[10px] text-stone-500 leading-5">
                Enter your email address and we will send you
                instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleForgotPasswordSubmit}>
              <label className="block text-[10px] uppercase tracking-[0.13em] text-stone-600 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={forgotEmail}
                onChange={(e) =>
                  setForgotEmail(e.target.value)
                }
                placeholder="client@avernus.com"
                className="w-full px-0 py-2.5 text-xs border-b border-stone-300 focus:border-black outline-none"
              />

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordOpen(false);
                    setForgotEmail("");
                  }}
                  className="flex-1 py-3 border border-stone-300 text-[9px] uppercase tracking-[0.18em] hover:border-black transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isModalLoading}
                  className="flex-1 py-3 bg-black text-white text-[9px] uppercase tracking-[0.18em] disabled:opacity-50"
                >
                  {isModalLoading
                    ? "Sending..."
                    : "Send Reset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}