import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import adminApi from "../utils/adminApi";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) navigate("/admin", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await adminApi.post("/login", { email, password });

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminInfo", JSON.stringify(data.admin));

        navigate("/admin", { replace: true });
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white text-black">
      {/* LEFT — BRAND PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-stone-950 items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative text-center px-12">
          <p className="text-stone-500 text-xs uppercase tracking-[0.5em] mb-8">
            Est. Boutique
          </p>
          <h1 className="font-serif text-white text-6xl tracking-[0.35em] mb-6">
            AVERNUS
          </h1>
          <div className="w-16 h-px bg-stone-700 mx-auto mb-6" />
          <p className="text-stone-400 text-sm tracking-[0.2em] uppercase">
            Administrator Access
          </p>
        </div>
      </div>

      {/* RIGHT — FORM PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-12 text-center lg:text-left">
            <h1 className="lg:hidden font-serif text-4xl tracking-[0.3em] mb-2">
              AVERNUS
            </h1>
            <p className="text-xs uppercase tracking-[0.4em] text-stone-400 mb-3">
              Admin Panel
            </p>
            <h2 className="font-serif text-3xl tracking-wide">Sign In</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-[0.25em] text-stone-500 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-stone-300 bg-transparent py-3 text-sm tracking-wide outline-none transition-colors focus:border-black"
                placeholder="admin@avernus.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-[0.25em] text-stone-500 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-stone-300 bg-transparent py-3 pr-10 text-sm tracking-wide outline-none transition-colors focus:border-black"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-stone-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 accent-black cursor-pointer"
                />
                Remember Me
              </label>
            </div>

            {error && (
              <p className="text-xs tracking-wide text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white text-xs uppercase tracking-[0.3em] py-4 rounded-full flex items-center justify-center gap-2 transition-all hover:bg-stone-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing In
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-10 text-center lg:text-left text-[11px] tracking-[0.2em] uppercase text-stone-400">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}
