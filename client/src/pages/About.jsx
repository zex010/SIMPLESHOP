
import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  FlaskConical,
  Crown,
  Clock,
  Package,
  Globe,
  Check,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// SECTION IMAGES
import aboutheroImg from "../assets/abouthero.jpg";
import storyImg from "../assets/journal2.jpg";
import bannerImg from "../assets/journal3.jpg";
import processImg from "../assets/process.jpg";
import unboxingImg from "../assets/unboxing.jpg";

// INGREDIENT IMAGES
import oudImg from "../assets/oud.jpg";
import bergamotImg from "../assets/bergamote.jpg";
import amberImg from "../assets/amber.jpg";
import jasmineImg from "../assets/jasmine.jpg";
import sandalwoodImg from "../assets/sandalwood.jpg";
import vanillaImg from "../assets/vanilla.jpg";

// =====================================================
// INGREDIENTS
// =====================================================

const INGREDIENTS = [
  {
    name: "Oud",
    origin: "Southeast Asia",
    description:
      "Smoky, dark heartwood resin prized for centuries for its resinous depth.",
    image: oudImg,
  },
  {
    name: "Bergamot",
    origin: "Calabria, Italy",
    description:
      "Sun-drenched citrus yielding an ethereal, sparkling top note.",
    image: bergamotImg,
  },
  {
    name: "Amber",
    origin: "Mediterranean",
    description:
      "Warm, golden accords that create an indelible lingering warmth.",
    image: amberImg,
  },
  {
    name: "Jasmine Sambac",
    origin: "Grasse, France",
    description:
      "Indolic nocturnal blossoms harvested exclusively at twilight.",
    image: jasmineImg,
  },
  {
    name: "Sandalwood",
    origin: "Mysore, India",
    description:
      "Creamy, velvety wood providing an enduring foundation to the structure.",
    image: sandalwoodImg,
  },
  {
    name: "Bourbon Vanilla",
    origin: "Madagascar",
    description:
      "Rich vanilla accords that ground floral notes with subtle sweetness.",
    image: vanillaImg,
  },
];

// =====================================================
// STAT COUNTER
// =====================================================

function StatCounter({ value, label }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated || isNaN(numericValue)) return;

    let start = 0;
    const duration = 1500;
    const increment = Math.max(
      1,
      Math.ceil(numericValue / (duration / 16))
    );

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
    <div
      ref={ref}
      className="text-center py-4 sm:py-5 min-w-0"
    >
      <h4 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-[0.08em] font-light mb-2">
        {isNaN(numericValue)
          ? value
          : `${count}${suffix}`}
      </h4>

      <p className="uppercase tracking-[0.2em] text-[8px] sm:text-[9px] text-stone-400 font-light break-words">
        {label}
      </p>
    </div>
  );
}

// =====================================================
// REUSABLE EDITORIAL IMAGE + TEXT SECTION
// =====================================================

function EditorialSection({
  image,
  imageAlt,
  eyebrow,
  title,
  children,
  imageLeft = true,
  imageHeight = "h-[340px] sm:h-[430px] lg:h-[540px]",
}) {
  return (
    <section className="w-full border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <div
          className={`grid lg:grid-cols-2 items-stretch ${
            imageLeft ? "" : "lg:[&>div:first-child]:order-2"
          }`}
        >
          {/* IMAGE */}

          <div
            className={`overflow-hidden bg-stone-100 ${imageLeft ? "" : "lg:order-2"}`}
          >
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              className={`w-full ${imageHeight} object-cover transition-transform duration-1000 ease-out hover:scale-105`}
            />
          </div>

          {/* TEXT */}

          <div
            className={`flex items-center ${
              imageLeft
                ? "lg:order-2"
                : "lg:order-1"
            }`}
          >
            <div className="w-full px-1 py-10 sm:py-14 lg:px-12 xl:px-16 lg:py-16">
              {eyebrow && (
                <p className="uppercase tracking-[0.28em] text-[9px] sm:text-[10px] text-stone-400 mb-4">
                  {eyebrow}
                </p>
              )}

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-[0.04em] font-normal leading-tight text-stone-950 break-words">
                {title}
              </h2>

              <div className="mt-6 space-y-4 text-stone-500 text-sm sm:text-[14px] leading-[1.9] font-light tracking-wide">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================
// ABOUT PAGE
// =====================================================

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
    <div className="min-h-screen bg-white text-stone-950 font-sans overflow-x-hidden">
      <Navbar />

      {/* =====================================================
          1. HERO
          IMAGE RIGHT / TEXT LEFT
      ===================================================== */}

      <section className="w-full border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 items-stretch min-h-[520px] lg:min-h-[620px]">

            {/* TEXT LEFT */}

            <div className="flex items-center order-1">
              <div className="w-full py-12 sm:py-16 lg:px-12 xl:px-16">
                <p className="uppercase tracking-[0.3em] text-[9px] sm:text-[10px] text-stone-400 mb-5">
                  About AVERNUS
                </p>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] tracking-[0.04em] font-normal leading-[1.15] break-words">
                  Crafting timeless
                  <br className="hidden sm:block" />
                  fragrances for
                  <br className="hidden sm:block" />
                  modern elegance.
                </h1>

                <p className="font-serif italic text-stone-400 text-sm sm:text-base tracking-wide max-w-md mt-6 leading-relaxed">
                  Every scent tells a story. Every bottle
                  captures a memory.
                </p>

                <div className="w-10 h-px bg-stone-300 mt-7" />
              </div>
            </div>

            {/* IMAGE RIGHT */}

            <div className="order-2 overflow-hidden bg-stone-100">
              <img
                src={aboutheroImg}
                alt="AVERNUS Luxury Perfume"
                className="w-full h-[360px] sm:h-[460px] lg:h-full min-h-[420px] object-cover transition-transform duration-[3000ms] hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          2. OUR STORY
          IMAGE LEFT / TEXT RIGHT
      ===================================================== */}

      <EditorialSection
        image={storyImg}
        imageAlt="AVERNUS Heritage"
        eyebrow="The Heritage"
        title="Our Story"
        imageLeft={true}
      >
        <p>
          AVERNUS was born out of a quiet reverence for
          the unrepeatable. Founded on the principle that
          true luxury lies in restraint and intention, our
          house pairs rare botanical extractions with
          contemporary olfactory minimalism.
        </p>

        <p>
          We reject mass manufacturing in favor of slow,
          deliberate maceration. Each formulation is
          developed over months in small batches, honoring
          traditional distillation while pushing the
          boundaries of modern niche perfumery.
        </p>

        <p className="font-serif italic text-stone-400 text-sm pt-2">
          — Paris · Grasse · Milan
        </p>
      </EditorialSection>

      {/* =====================================================
          3. BRAND PHILOSOPHY
      ===================================================== */}

      <section className="border-b border-stone-200 bg-stone-50/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">

          <div className="text-center mb-12">
            <p className="uppercase tracking-[0.28em] text-[9px] text-stone-400 mb-3">
              Our Philosophy
            </p>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-[0.04em]">
              The AVERNUS Standard
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-14">

            <div className="text-center md:text-left space-y-4">
              <div className="inline-flex items-center justify-center p-3 border border-stone-200 rounded-full">
                <Sparkles size={19} strokeWidth={1.2} />
              </div>

              <h3 className="font-serif text-xl tracking-wide">
                Finest Ingredients
              </h3>

              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-light">
                Exceptional raw materials sourced from
                selected farms and historic harvests around
                the world.
              </p>
            </div>

            <div className="text-center md:text-left space-y-4">
              <div className="inline-flex items-center justify-center p-3 border border-stone-200 rounded-full">
                <FlaskConical size={19} strokeWidth={1.2} />
              </div>

              <h3 className="font-serif text-xl tracking-wide">
                Master Craftsmanship
              </h3>

              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-light">
                Every fragrance is blended with precision
                and artistic intuition to create a balanced
                olfactory experience.
              </p>
            </div>

            <div className="text-center md:text-left space-y-4">
              <div className="inline-flex items-center justify-center p-3 border border-stone-200 rounded-full">
                <Crown size={19} strokeWidth={1.2} />
              </div>

              <h3 className="font-serif text-xl tracking-wide">
                Timeless Luxury
              </h3>

              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-light">
                Designed to move beyond seasonal trends
                and become a lasting personal signature.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          4. EDITORIAL BANNER
          IMAGE RIGHT / TEXT LEFT
      ===================================================== */}

      <EditorialSection
        image={bannerImg}
        imageAlt="Luxury Perfume Atmosphere"
        eyebrow="The AVERNUS Perspective"
        title="Luxury is remembered long after the fragrance fades."
        imageLeft={false}
        imageHeight="h-[340px] sm:h-[430px] lg:h-[540px]"
      >
        <p>
          AVERNUS approaches fragrance as more than an
          accessory. Each composition is created to become
          part of a memory, a place, or a particular moment
          in time.
        </p>

        <p className="font-serif italic text-stone-400">
          A signature should feel personal.
        </p>
      </EditorialSection>

      {/* =====================================================
          5. ART OF PERFUMERY
          IMAGE LEFT / TEXT RIGHT
      ===================================================== */}

      <EditorialSection
        image={processImg}
        imageAlt="Art of perfume creation"
        eyebrow="Process & Alchemy"
        title="The Art Of Perfumery"
        imageLeft={true}
      >
        <p>
          The architecture of an AVERNUS perfume is guided
          by patience. From the initial sketch to final
          bottling, our creations move through inspiration,
          sourcing, blending, maturation, and presentation.
        </p>

        <p>
          Each composition is given time to develop so that
          its natural oils and accords can settle into a
          harmonious structure with depth, warmth, and
          lasting character.
        </p>
      </EditorialSection>

      {/* =====================================================
          6. SIGNATURE INGREDIENTS
          ALTERNATING IMAGE / TEXT
      ===================================================== */}

      <section className="w-full border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-16 sm:py-20">

          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <p className="uppercase tracking-[0.28em] text-[9px] sm:text-[10px] text-stone-400 mb-3">
              Raw Materials
            </p>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-[0.04em]">
              Signature Ingredients
            </h2>

            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed mt-4 font-light">
              Selected materials form the foundation of
              every AVERNUS composition.
            </p>
          </div>

          <div className="space-y-0">
            {INGREDIENTS.map((ingredient, index) => (
              <EditorialSection
                key={ingredient.name}
                image={ingredient.image}
                imageAlt={ingredient.name}
                eyebrow={ingredient.origin}
                title={ingredient.name}
                imageLeft={index % 2 === 0}
                imageHeight="h-[300px] sm:h-[380px] lg:h-[460px]"
              >
                <p>{ingredient.description}</p>

                <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400 pt-2">
                  Signature AVERNUS Ingredient
                </p>
              </EditorialSection>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          7. WHY CHOOSE AVERNUS
      ===================================================== */}

      <section className="bg-stone-50/70 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">

          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="uppercase tracking-[0.28em] text-[9px] text-stone-400 mb-3">
              The AVERNUS Distinction
            </p>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-[0.04em]">
              Why Choose AVERNUS
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">

            <div className="bg-white p-6 sm:p-7 border border-stone-200/70 space-y-4">
              <Clock
                size={21}
                strokeWidth={1.2}
              />

              <h3 className="font-serif text-lg sm:text-xl tracking-wide">
                Long Lasting Performance
              </h3>

              <p className="text-stone-500 text-xs leading-relaxed font-light">
                High fragrance concentration provides
                lasting performance and refined sillage.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 border border-stone-200/70 space-y-4">
              <Sparkles
                size={21}
                strokeWidth={1.2}
              />

              <h3 className="font-serif text-lg sm:text-xl tracking-wide">
                Premium Ingredients
              </h3>

              <p className="text-stone-500 text-xs leading-relaxed font-light">
                Carefully selected botanicals and rare
                materials form the heart of each creation.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 border border-stone-200/70 space-y-4">
              <Package
                size={21}
                strokeWidth={1.2}
              />

              <h3 className="font-serif text-lg sm:text-xl tracking-wide">
                Elegant Packaging
              </h3>

              <p className="text-stone-500 text-xs leading-relaxed font-light">
                Minimal monochromatic packaging designed
                to complement the fragrance experience.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 border border-stone-200/70 space-y-4">
              <Globe
                size={21}
                strokeWidth={1.2}
              />

              <h3 className="font-serif text-lg sm:text-xl tracking-wide">
                Worldwide Delivery
              </h3>

              <p className="text-stone-500 text-xs leading-relaxed font-light">
                Carefully prepared orders delivered to
                customers across selected destinations.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          8. BRAND STATISTICS
      ===================================================== */}

      <section className="border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 sm:py-18">

          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-stone-200">

            <StatCounter
              value="50+"
              label="Luxury Fragrances"
            />

            <StatCounter
              value="20+"
              label="Countries Served"
            />

            <StatCounter
              value="100%"
              label="Premium Ingredients"
            />

            <StatCounter
              value="10K+"
              label="Satisfied Clients"
            />

          </div>
        </div>
      </section>

      {/* =====================================================
          9. CUSTOMER EXPERIENCE
          IMAGE RIGHT / TEXT LEFT
      ===================================================== */}

      <EditorialSection
        image={unboxingImg}
        imageAlt="Luxury Packaging Ritual"
        eyebrow="Unboxing & Ritual"
        title="The Customer Experience"
        imageLeft={false}
      >
        <p>
          From the weight of the bottle to the first
          atomized mist against the skin, receiving an
          AVERNUS fragrance is designed as a considered
          sensory ritual.
        </p>

        <p>
          Every order is prepared with attention to detail,
          turning the arrival of a fragrance into an
          experience that begins before the first spray.
        </p>
      </EditorialSection>

      {/* =====================================================
          10. NEWSLETTER
      ===================================================== */}

      <section className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-16 sm:py-20 text-center">

          <p className="uppercase tracking-[0.28em] text-[9px] text-stone-400 mb-3">
            AVERNUS Gazette
          </p>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-[0.04em]">
            Stay Inspired
          </h2>

          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed max-w-md mx-auto mt-4 font-light">
            Receive fragrance stories, collection
            announcements, and selected AVERNUS news.
          </p>

          {subscribed ? (
            <div className="mt-7 inline-flex items-center gap-2 uppercase tracking-[0.2em] text-[9px] sm:text-[10px] text-black border border-stone-300 py-3 px-6">
              <Check size={14} />
              Thank you for subscribing.
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto pt-6"
            >
              <input
                type="email"
                required
                placeholder="ENTER YOUR EMAIL"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="
                  w-full
                  px-3
                  py-2.5
                  bg-transparent
                  border-b
                  border-stone-300
                  text-[10px]
                  tracking-[0.18em]
                  focus:outline-none
                  focus:border-black
                  placeholder:text-stone-400
                  uppercase
                  font-light
                "
              />

              <button
                type="submit"
                className="
                  w-full
                  sm:w-auto
                  px-7
                  py-2.5
                  bg-black
                  text-white
                  text-[9px]
                  uppercase
                  tracking-[0.22em]
                  hover:bg-stone-800
                  transition-colors
                  whitespace-nowrap
                "
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* =====================================================
          11. FINAL QUOTE
      ===================================================== */}

      <section className="py-20 sm:py-24 lg:py-28 text-center px-5">
        <div className="max-w-2xl mx-auto">

          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight font-normal tracking-wide">
            “A fragrance should be remembered long
            after the moment has passed.”
          </blockquote>

          <p className="uppercase tracking-[0.28em] text-[9px] sm:text-[10px] text-stone-400 mt-5">
            — AVERNUS
          </p>

        </div>
      </section>

      <Footer />
    </div>
  );
}

