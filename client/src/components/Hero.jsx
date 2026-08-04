import React from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "../assets/hero.png";
import BrandLogo from "./BrandLogo";

export default function Hero() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <section className="relative w-full h-[80vh] md:h-screen overflow-hidden bg-white">

      {/* HERO BACKGROUND */}
      <img
        src={heroBg}
        alt="Avernus Hero"
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          pointer-events-none
        "
      />

      {/* DARK OVERLAY */}
      <div
        className="
          absolute
          inset-0
          bg-black/10
          pointer-events-none
        "
      />


      {/* BRAND LOGO */}
      <div
        onClick={handleLogoClick}
        className="
          absolute
          top-12
          md:top-16
          left-1/2
          -translate-x-1/2
          z-50
          cursor-pointer
          pointer-events-auto
        "
      >
        <BrandLogo variant="splash" />
      </div>

    </section>
  );
}