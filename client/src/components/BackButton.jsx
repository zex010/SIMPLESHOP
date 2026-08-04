import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * Same look/behavior as the back button inside Navbar.jsx:
 * - goes to browser history back if there is any
 * - otherwise falls back to "/home"
 *
 * variant="light" -> use on top of dark/photo backgrounds (Men, Women hero)
 * variant="dark"  -> use on top of white/light backgrounds (Collection hero)
 */
export default function BackButton({ to = "/home", variant = "dark" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(to);
    }
  };

  const colorClasses =
    variant === "light"
      ? "text-white hover:text-stone-300"
      : "text-stone-800 hover:text-stone-500";

  return (
    <button
      onClick={handleBack}
      title="Go Back"
      className={`absolute top-6 left-6 md:top-8 md:left-8 z-30 flex items-center gap-1.5 uppercase tracking-[0.2em] text-[11px] md:text-xs font-medium transition cursor-pointer ${colorClasses}`}
    >
      <ArrowLeft size={15} />
      <span className="hidden sm:inline">BACK</span>
    </button>
  );
}
