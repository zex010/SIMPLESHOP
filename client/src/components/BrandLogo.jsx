import React from "react";
import logoImage from "../assets/Avernus.png";

export default function BrandLogo({ variant = "navbar", onClick }) {
  // Splash / Hero variant: render as TEXT so it sits directly on the
  // background image with no white box behind it (the PNG logo has a
  // solid white background, which is why it was showing as a box).
  if (variant === "splash") {
    return (
      <h1
        onClick={onClick}
        className={`font-serif text-white tracking-[0.5em] text-2xl md:text-4xl uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] select-none ${
          onClick ? "cursor-pointer" : ""
        }`}
      >
        Avernus
      </h1>
    );
  }

  // Navbar / Footer variants: these sit on white backgrounds already,
  // so the logo image is fine here.
  const sizeClasses = {
    navbar: "w-32 md:w-40",
    footer: "w-28 md:w-32",
  };

  return (
    <img
      src={logoImage}
      alt="Avernus"
      onClick={onClick}
      className={`${sizeClasses[variant] || sizeClasses.navbar} object-contain ${
        onClick ? "cursor-pointer" : ""
      }`}
    />
  );
}