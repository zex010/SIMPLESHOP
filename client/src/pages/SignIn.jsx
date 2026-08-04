import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

// Configure Axios Base Instance
const API_BASE_URL = 'http://192.168.1.6:5000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function SignIn() {
  const navigate = useNavigate();

  // Active Tab: 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState('signin');

  // UI Flow States
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Feedback Notifications (Toast/Alerts)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [serverError, setServerError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });

  // Forgot Password Field
  const [forgotEmail, setForgotEmail] = useState('');

  // Field Validation Errors
  const [errors, setErrors] = useState({});

  // Trigger Toast Notification Helper
  const showToastNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Clear errors when switching tabs
  useEffect(() => {
    setErrors({});
    setServerError('');
  }, [activeTab]);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear validation error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  // Form Validation Logic
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (activeTab === 'signup') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required.';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required.';
      }
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required.';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required.';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Sign In Submit
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError('');

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      if (formData.rememberMe) {
        localStorage.setItem('auth_token', token);
      } else {
        sessionStorage.setItem('auth_token', token);
      }

      showToastNotification('Welcome back. Redirecting...', 'success');

      setTimeout(() => {
        navigate('/home');
      }, 1200);
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid credentials or server unavailable.';
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Create Account Submit
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError('');

    try {
      await api.post('/auth/register', {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        password: formData.password,
      });

      const registeredEmail = formData.email;

      showToastNotification('Account created successfully. Please sign in.', 'success');

      // Reset form and preserve registered email for Sign In tab
      setFormData({
        firstName: '',
        lastName: '',
        email: registeredEmail,
        phoneNumber: '',
        address: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
      });

      // Switch tab to Sign In automatically
      setActiveTab('signin');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Email may already be in use.';
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      showToastNotification('Please enter a valid email address.', 'error');
      return;
    }

    setIsModalLoading(true);

    try {
      await api.post('/auth/forgot-password', { email: forgotEmail });
      showToastNotification('Password reset instructions sent to your email.', 'success');
      setIsForgotPasswordOpen(false);
      setForgotEmail('');
    } catch (err) {
      showToastNotification(err.response?.data?.message || 'Failed to send reset email.', 'error');
    } finally {
      setIsModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-stone-900 font-sans flex flex-col md:flex-row antialiased">
      {/* Toast Notification Container */}
      {toast.show && (
        <div
          role="alert"
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 border shadow-sm transition-all transform duration-300 ${
            toast.type === 'success'
              ? 'bg-stone-950 text-white border-stone-800'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          {toast.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          <span className="text-xs uppercase tracking-widest font-medium">{toast.message}</span>
        </div>
      )}

      {/* LEFT COLUMN: Luxury Visual Branding */}
      <div className="relative w-full md:w-1/2 min-h-[350px] md:min-h-screen bg-stone-950 flex flex-col items-center justify-between p-8 md:p-12 overflow-hidden">
        {/* Background Editorial Image with lowered center position */}
        <img
          src="src/assets/perfumes.jpg"
          alt="AVERNUS Perfume Bottle"
          className="absolute inset-0 w-full h-full object-cover object-bottom grayscale contrast-125 opacity-50 scale-105 transition-transform duration-1000 ease-out hover:scale-100"
        />

        {/* Gradient Overlay for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/30 to-stone-950/70" />

        {/* Top Spacer / Header Brand Label */}
        <div className="relative z-10 w-full text-center pt-4 md:pt-8">
          <span className="text-[10px] uppercase tracking-[0.4em] text-stone-300 font-mono">
            Haute Parfumerie
          </span>
        </div>

        {/* Structural Logo & Text Positioning */}
        <div className="relative z-10 text-center max-w-lg mx-auto flex flex-col items-center my-auto transform -translate-y-12 md:-translate-y-20">
          <div
            onClick={() => navigate('/home')}
            className="cursor-pointer transition-opacity hover:opacity-80"
          >
            <BrandLogo variant="splash" />
          </div>
          <div className="w-8 h-[1px] bg-white/40 my-5" />
          <p className="text-xs md:text-sm tracking-[0.25em] text-stone-200 font-light italic drop-shadow-sm">
            "Crafted for timeless elegance."
          </p>
        </div>

        {/* Subtle Footer Watermark */}
        <div className="relative z-10 w-full text-center md:text-left text-[9px] uppercase tracking-[0.3em] text-stone-400 font-mono">
          Est. Paris &bull; London &bull; New York
        </div>
      </div>

      {/* RIGHT COLUMN: Auth Interface */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-16 bg-white">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Go Back */}
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/home');
              }
            }}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-stone-500 hover:text-black transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>

          {/* Main Auth View */}
          <>
            {/* Tab Navigation */}
            <div className="flex border-b border-stone-200">
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className={`flex-1 pb-4 text-xs tracking-[0.2em] uppercase transition-colors relative font-medium ${
                  activeTab === 'signin' ? 'text-black font-semibold' : 'text-stone-400 hover:text-stone-600'
                }`}
                aria-selected={activeTab === 'signin'}
                role="tab"
              >
                Sign In
                {activeTab === 'signin' && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`flex-1 pb-4 text-xs tracking-[0.2em] uppercase transition-colors relative font-medium ${
                  activeTab === 'signup' ? 'text-black font-semibold' : 'text-stone-400 hover:text-stone-600'
                }`}
                aria-selected={activeTab === 'signup'}
                role="tab"
              >
                Create Account
                {activeTab === 'signup' && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black" />
                )}
              </button>
            </div>

            {/* Server-Level Error Alert */}
            {serverError && (
              <div className="p-4 bg-stone-50 border border-stone-300 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <p className="text-xs text-stone-800 tracking-wide leading-relaxed">{serverError}</p>
              </div>
            )}

            {/* SIGN IN FORM */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-6" noValidate>
                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="signin-email"
                    className="block text-[11px] uppercase tracking-[0.15em] text-stone-600 font-medium"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="signin-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="client@avernus.com"
                      className={`w-full px-0 py-3 text-sm bg-transparent border-b ${
                        errors.email ? 'border-red-500' : 'border-stone-300 focus:border-black'
                      } outline-none transition-colors placeholder:text-stone-300 font-light`}
                      aria-invalid={!!errors.email}
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-red-600 tracking-wide">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="signin-password"
                      className="block text-[11px] uppercase tracking-[0.15em] text-stone-600 font-medium"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(true)}
                      className="text-[11px] uppercase tracking-[0.1em] text-stone-500 hover:text-black transition-colors underline underline-offset-4"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className={`w-full pr-10 py-3 text-sm bg-transparent border-b ${
                        errors.password ? 'border-red-500' : 'border-stone-300 focus:border-black'
                      } outline-none transition-colors placeholder:text-stone-300 font-light`}
                      aria-invalid={!!errors.password}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black p-2 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] text-red-600 tracking-wide">{errors.password}</p>}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-3 pt-2">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded-none border-stone-300 text-black focus:ring-0 focus:ring-offset-0 cursor-pointer accent-black"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-stone-600 tracking-wide cursor-pointer">
                    Remember me for future visits
                  </label>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-black text-white text-xs uppercase tracking-[0.25em] font-medium border border-black hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-8 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200" />
                  </div>
                  <span className="relative bg-white px-4 text-[10px] uppercase tracking-[0.2em] text-stone-400">
                    OR
                  </span>
                </div>

                {/* Disabled Google Sign-In Button */}
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 bg-stone-100 text-stone-400 text-xs uppercase tracking-[0.2em] font-medium border border-stone-200 cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <svg className="w-4 h-4 opacity-40" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google Sign-In coming soon</span>
                </button>

                {/* Switch Tab Helper */}
                <div className="text-center pt-4">
                  <p className="text-xs text-stone-500 tracking-wide">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('signup')}
                      className="text-black font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* CREATE ACCOUNT FORM */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-5" noValidate>
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="signup-firstname"
                      className="block text-[11px] uppercase tracking-[0.15em] text-stone-600 font-medium"
                    >
                      First Name
                    </label>
                    <input
                      id="signup-firstname"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Henri"
                      className={`w-full px-0 py-2.5 text-sm bg-transparent border-b ${
                        errors.firstName ? 'border-red-500' : 'border-stone-300 focus:border-black'
                      } outline-none transition-colors placeholder:text-stone-300 font-light`}
                    />
                    {errors.firstName && (
                      <p className="text-[10px] text-red-600 tracking-wide">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="signup-lastname"
                      className="block text-[11px] uppercase tracking-[0.15em] text-stone-600 font-medium"
                    >
                      Last Name
                    </label>
                    <input
                      id="signup-lastname"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="D'Orsay"
                      className={`w-full px-0 py-2.5 text-sm bg-transparent border-b ${
                        errors.lastName ? 'border-red-500' : 'border-stone-300 focus:border-black'
                      } outline-none transition-colors placeholder:text-stone-300 font-light`}
                    />
                    {errors.lastName && (
                      <p className="text-[10px] text-red-600 tracking-wide">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="signup-email"
                    className="block text-[11px] uppercase tracking-[0.15em] text-stone-600 font-medium"
                  >
                    Email Address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="client@avernus.com"
                    className={`w-full px-0 py-2.5 text-sm bg-transparent border-b ${
                      errors.email ? 'border-red-500' : 'border-stone-300 focus:border-black'
                    } outline-none transition-colors placeholder:text-stone-300 font-light`}
                  />
                  {errors.email && <p className="text-[10px] text-red-600 tracking-wide">{errors.email}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label
                    htmlFor="signup-phone"
                    className="block text-[11px] uppercase tracking-[0.15em] text-stone-600 font-medium"
                  >
                    Phone Number
                  </label>
                  <input
                    id="signup-phone"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+1 555 019 2834"
                    className={`w-full px-0 py-2.5 text-sm bg-transparent border-b ${
                      errors.phoneNumber ? 'border-red-500' : 'border-stone-300 focus:border-black'
                    } outline-none transition-colors placeholder:text-stone-300 font-light`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-[10px] text-red-600 tracking-wide">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label
                    htmlFor="signup-address"
                    className="block text-[11px] uppercase tracking-[0.15em] text-stone-600 font-medium"
                  >
                    Shipping Address
                  </label>
                  <input
                    id="signup-address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="12 Place Vendôme, Paris"
                    className={`w-full px-0 py-2.5 text-sm bg-transparent border-b ${
                      errors.address ? 'border-red-500' : 'border-stone-300 focus:border-black'
                    } outline-none transition-colors placeholder:text-stone-300 font-light`}
                  />
                  {errors.address && (
                    <p className="text-[10px] text-red-600 tracking-wide">{errors.address}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="signup-password"
                    className="block text-[11px] uppercase tracking-[0.15em] text-stone-600 font-medium"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="At least 8 characters"
                      className={`w-full pr-10 py-2.5 text-sm bg-transparent border-b ${
                        errors.password ? 'border-red-500' : 'border-stone-300 focus:border-black'
                      } outline-none transition-colors placeholder:text-stone-300 font-light`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black p-2 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[10px] text-red-600 tracking-wide">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="signup-confirmpassword"
                    className="block text-[11px] uppercase tracking-[0.15em] text-stone-600 font-medium"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="signup-confirmpassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Re-enter password"
                      className={`w-full pr-10 py-2.5 text-sm bg-transparent border-b ${
                        errors.confirmPassword ? 'border-red-500' : 'border-stone-300 focus:border-black'
                      } outline-none transition-colors placeholder:text-stone-300 font-light`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black p-2 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[10px] text-red-600 tracking-wide">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-black text-white text-xs uppercase tracking-[0.25em] font-medium border border-black hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </form>
            )}
          </>
        </div>
      </div>
    </div>
  );
}