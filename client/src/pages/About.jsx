import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  FlaskConical, 
  Crown, 
  Clock, 
  Package, 
  Globe, 
  Check, 
  ArrowRight 
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// SECTION IMAGE IMPORTS FROM src/assets
import aboutheroImg from "../assets/abouthero.jpg";
import storyImg from "../assets/journal2.jpg";
import bannerImg from "../assets/journal3.jpg";
import processImg from "../assets/process.jpg"; // Add your process image to src/assets
import unboxingImg from "../assets/unboxing.jpg"; // Add your unboxing image to src/assets

// INGREDIENT IMAGE IMPORTS FROM src/assets
import oudImg from "../assets/oud.jpg";
import bergamotImg from "../assets/bergamote.jpg";
import amberImg from "../assets/amber.jpg";
import jasmineImg from "../assets/jasmine.jpg";
import sandalwoodImg from "../assets/sandalwood.jpg";
import vanillaImg from "../assets/vanilla.jpg";

// INGREDIENTS DATA WITH LOCAL ASSETS
const INGREDIENTS = [
  {
    name: "Oud",
    origin: "Southeast Asia",
    description: "Smoky, dark heartwood resin prized for centuries for its resinous depth.",
    image: oudImg,
  },
  {
    name: "Bergamot",
    origin: "Calabria, Italy",
    description: "Sun-drenched citrus yielding an ethereal, sparkling top note.",
    image: bergamotImg,
  },
  {
    name: "Amber",
    origin: "Mediterranean",
    description: "Warm, golden, and tactile accords that create an indelible lingering warmth.",
    image: amberImg,
  },
  {
    name: "Jasmine Sambac",
    origin: "Grasse, France",
    description: "Indolic nocturnal blossoms harvested exclusively at twilight.",
    image: jasmineImg,
  },
  {
    name: "Sandalwood",
    origin: "Mysore, India",
    description: "Creamy, velvety wood providing an enduring foundation to the structure.",
    image: sandalwoodImg,
  },
  {
    name: "Bourbon Vanilla",
    origin: "Madagascar",
    description: "Rich, unctuous pod accords that ground floral top notes with subtle sweetness.",
    image: vanillaImg,
  },
];

// STATS ANIMATION HOOK
function StatCounter({ value, label }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  // Extract number vs text (e.g., "50+" -> numeric: 50, suffix: "+")
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated || isNaN(numericValue)) return;

    let start = 0;
    const duration = 2000;
    const increment = Math.ceil(numericValue / (duration / 16));

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [hasAnimated, numericValue]);

  return (
    <div ref={ref} className="text-center py-6">
      <h4 className="font-serif text-4xl md:text-6xl tracking-widest font-light mb-3">
        {isNaN(numericValue) ? value : `${count}${suffix}`}
      </h4>
      <p className="uppercase tracking-[0.35em] text-[11px] text-stone-400 font-light">
        {label}
      </p>
    </div>
  );
}

export default function About() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-stone-200">
      <Navbar />

      {/* 1. FULL SCREEN HERO */}
      <section className="relative h-screen w-full overflow-hidden bg-black text-white flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={aboutheroImg}
            alt="AVERNUS Luxury Perfume"
            className="w-full h-full object-cover opacity-40 scale-105 animate-pulse transition-transform duration-[10000ms] hover:scale-100"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8 animate-fadeIn">
          <p className="uppercase tracking-[0.6em] text-xs text-stone-300 font-light">
            ABOUT AVERNUS
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-[0.1em] font-normal leading-tight">
            Crafting timeless fragrances <br /> for modern elegance.
          </h1>
          <p className="font-serif italic text-stone-300 text-lg md:text-xl tracking-widest max-w-xl mx-auto font-light">
            Every scent tells a story. Every bottle captures a memory.
          </p>
        </div>
      </section>

      {/* 2. OUR STORY */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-28 md:py-36">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="overflow-hidden bg-stone-100">
            <img
              src={storyImg}
              alt="AVERNUS Heritage"
              loading="lazy"
              className="w-full h-[500px] md:h-[650px] object-cover hover:scale-105 transition-transform duration-1000 ease-out"
            />
          </div>

          <div className="space-y-8">
            <p className="uppercase tracking-[0.45em] text-xs text-stone-400">
              The Heritage
            </p>
            <h2 className="font-serif text-3xl md:text-5xl tracking-[0.08em] font-normal leading-tight">
              Our Story
            </h2>
            <p className="text-stone-600 text-base md:text-[16px] leading-[2.1] font-light tracking-wide">
              AVERNUS was born out of a quiet reverence for the unrepeatable. Founded on the principle that true luxury lies in restraint and intention, our house pairs rare botanical extractions with contemporary olfactory minimalism.
            </p>
            <p className="text-stone-600 text-base md:text-[16px] leading-[2.1] font-light tracking-wide">
              We reject mass manufacturing in favor of slow, deliberate maceration. Each formulation is developed over months in small batches, honoring ancient Mediterranean distillation while pushing the boundaries of modern niche perfumery.
            </p>
            <div className="pt-4">
              <span className="font-serif italic text-stone-400 text-lg">
                — Paris · Grasse · Milan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BRAND PHILOSOPHY */}
      <section className="border-y border-stone-200 py-24 bg-stone-50/50">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="group space-y-6 text-center md:text-left">
              <div className="inline-flex items-center justify-center p-4 border border-stone-200 rounded-full text-black group-hover:bg-black group-hover:text-white transition-all duration-500">
                <Sparkles size={22} strokeWidth={1.2} />
              </div>
              <h3 className="font-serif text-2xl tracking-wide font-normal">
                Finest Ingredients
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed font-light tracking-wide">
                We source exceptional raw materials from small-holder farms and historic harvests around the globe.
              </p>
            </div>

            <div className="group space-y-6 text-center md:text-left">
              <div className="inline-flex items-center justify-center p-4 border border-stone-200 rounded-full text-black group-hover:bg-black group-hover:text-white transition-all duration-500">
                <FlaskConical size={22} strokeWidth={1.2} />
              </div>
              <h3 className="font-serif text-2xl tracking-wide font-normal">
                Master Craftsmanship
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed font-light tracking-wide">
                Every fragrance is blended with razor precision and artistic intuition by renowned master perfumers.
              </p>
            </div>

            <div className="group space-y-6 text-center md:text-left">
              <div className="inline-flex items-center justify-center p-4 border border-stone-200 rounded-full text-black group-hover:bg-black group-hover:text-white transition-all duration-500">
                <Crown size={22} strokeWidth={1.2} />
              </div>
              <h3 className="font-serif text-2xl tracking-wide font-normal">
                Timeless Luxury
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed font-light tracking-wide">
                Designed to transcend fleeting trends, creating an indelible signature that outlasts seasons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FULL WIDTH EDITORIAL BANNER */}
      <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden bg-black flex items-center justify-center my-28">
        <img
          src={bannerImg}
          alt="Luxury Perfume Atmosphere"
          loading="lazy"
          className="w-full h-full object-cover opacity-50 scale-100 hover:scale-105 transition-transform duration-10000 ease-out"
        />
        <div className="absolute z-10 px-6 text-center max-w-3xl">
          <blockquote className="font-serif text-3xl md:text-5xl lg:text-6xl text-white font-normal leading-tight tracking-wide italic">
            “Luxury is remembered long after the fragrance fades.”
          </blockquote>
        </div>
      </section>

      {/* 5. THE ART OF PERFUMERY */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="uppercase tracking-[0.45em] text-xs text-stone-400">
            Process & Alchemy
          </p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-[0.08em] font-normal">
            The Art Of Perfumery
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-stone-600 text-base md:text-[16px] leading-[2.1] font-light tracking-wide">
            <p>
              The architecture of an AVERNUS perfume is guided by patience. From initial sketch to final bottling, our creations move through five foundational pillars: inspiration, rigorous sourcing, harmonious blending, extended maturation, and artisan glassmaking.
            </p>
            <p>
              We allow our extractions to macerate for a minimum of eight weeks in climate-controlled dark cellars. This vital resting period enables natural essential oils and absolutes to bind deeply with organic alcohol, achieving unparalleled warmth, projection, and longevity.
            </p>
          </div>

          <div className="overflow-hidden bg-stone-100">
            <img
              src={processImg}
              alt="Art of perfume creation"
              loading="lazy"
              className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </div>
      </section>

      {/* 6. SIGNATURE INGREDIENTS */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-28 border-t border-stone-200">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <p className="uppercase tracking-[0.45em] text-xs text-stone-400">
            Raw Materials
          </p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-[0.08em] font-normal">
            Signature Ingredients
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {INGREDIENTS.map((ing, idx) => (
            <div key={idx} className="group space-y-6">
              <div className="overflow-hidden bg-stone-100 h-[300px]">
                <img
                  src={ing.image}
                  alt={ing.name}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              </div>
              <div className="space-y-2">
                <span className="uppercase tracking-[0.3em] text-[10px] text-stone-400">
                  {ing.origin}
                </span>
                <h3 className="font-serif text-2xl tracking-wide font-normal">
                  {ing.name}
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed font-light tracking-wide">
                  {ing.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. WHY CHOOSE AVERNUS */}
      <section className="bg-stone-50/70 border-y border-stone-200 py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <p className="uppercase tracking-[0.45em] text-xs text-stone-400">
              The Avernus Distinction
            </p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-[0.08em] font-normal">
              Why Choose AVERNUS
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="bg-white p-10 border border-stone-200/60 space-y-6 hover:-translate-y-1 transition-transform duration-500">
              <Clock size={24} strokeWidth={1.2} className="text-black" />
              <h3 className="font-serif text-xl tracking-wide font-normal">
                Long Lasting Performance
              </h3>
              <p className="text-stone-500 text-xs leading-relaxed font-light">
                High Extrait de Parfum concentration ensures all-day longevity and sophisticated sillage.
              </p>
            </div>

            <div className="bg-white p-10 border border-stone-200/60 space-y-6 hover:-translate-y-1 transition-transform duration-500">
              <Sparkles size={24} strokeWidth={1.2} className="text-black" />
              <h3 className="font-serif text-xl tracking-wide font-normal">
                Premium Ingredients
              </h3>
              <p className="text-stone-500 text-xs leading-relaxed font-light">
                Ethically harvested botanicals and rare absolutes sourced directly from certified estates.
              </p>
            </div>

            <div className="bg-white p-10 border border-stone-200/60 space-y-6 hover:-translate-y-1 transition-transform duration-500">
              <Package size={24} strokeWidth={1.2} className="text-black" />
              <h3 className="font-serif text-xl tracking-wide font-normal">
                Elegant Packaging
              </h3>
              <p className="text-stone-500 text-xs leading-relaxed font-light">
                Hand-finished monochromatic boxes wrapped in weighted tactile paper stock.
              </p>
            </div>

            <div className="bg-white p-10 border border-stone-200/60 space-y-6 hover:-translate-y-1 transition-transform duration-500">
              <Globe size={24} strokeWidth={1.2} className="text-black" />
              <h3 className="font-serif text-xl tracking-wide font-normal">
                Worldwide Delivery
              </h3>
              <p className="text-stone-500 text-xs leading-relaxed font-light">
                Insured express global courier shipping with personalized unboxing presentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BRAND STATISTICS */}
      <section className="py-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x-0 sm:divide-x divide-stone-200">
            <StatCounter value="50+" label="Luxury Fragrances" />
            <StatCounter value="20+" label="Countries Served" />
            <StatCounter value="100%" label="Premium Ingredients" />
            <StatCounter value="10K+" label="Satisfied Clients" />
          </div>
        </div>
      </section>

      {/* 9. CUSTOMER EXPERIENCE SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-28">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <p className="uppercase tracking-[0.45em] text-xs text-stone-400">
              Unboxing & Ritual
            </p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-[0.08em] font-normal leading-tight">
              The Customer Experience
            </h2>
            <p className="text-stone-600 text-base md:text-[16px] leading-[2.1] font-light tracking-wide">
              From the weight of the embossed cap to the first atomized mist against the skin, receiving an AVERNUS fragrance is designed as a sensory ritual.
            </p>
            <p className="text-stone-600 text-base md:text-[16px] leading-[2.1] font-light tracking-wide">
              Every shipment arrives enclosed in soft cotton canvas with complimentary sample vials, allowing you to test new compositions in the comfort of your sanctuary before opening the main flacon.
            </p>
          </div>

          <div className="order-1 lg:order-2 overflow-hidden bg-stone-100">
            <img
              src={unboxingImg}
              alt="Luxury Packaging Ritual"
              loading="lazy"
              className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </div>
      </section>

      {/* 10. NEWSLETTER */}
      <section className="bg-stone-50 border-y border-stone-200 py-28 text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <p className="uppercase tracking-[0.45em] text-xs text-stone-400">
            AVERNUS GAZETTE
          </p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-[0.08em] font-normal">
            Stay Inspired
          </h2>
          <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto font-light">
            Receive exclusive fragrance stories, private formulation releases, and new collection announcements.
          </p>

          {subscribed ? (
            <div className="pt-6 inline-flex items-center gap-3 uppercase tracking-[0.35em] text-xs text-black border border-stone-300 py-4 px-8">
              <Check size={16} /> Thank you for subscribing.
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-4"
            >
              <input
                type="email"
                required
                placeholder="ENTER YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border-b border-stone-300 text-xs tracking-[0.25em] focus:outline-none focus:border-black placeholder:text-stone-400 uppercase font-light"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-3 bg-black text-white text-xs uppercase tracking-[0.35em] hover:bg-stone-800 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 11. BEFORE FOOTER QUOTE */}
      <section className="py-32 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <blockquote className="font-serif text-3xl md:text-5xl leading-tight font-normal tracking-wide">
            “A fragrance should be remembered long after the moment has passed.”
          </blockquote>
          <p className="uppercase tracking-[0.45em] text-xs text-stone-400">
            — AVERNUS
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}