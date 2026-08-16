import { useEffect, useState } from "react";
import api from "../services/api";
import { ArrowRight, Sparkles, Droplets, Award } from "lucide-react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.products);
      } catch (error) {
        console.log("Product Fetch Error:", error);
      }
    };

    getProducts();
  }, []);

  return (
    <div className="bg-white antialiased">

      <Navbar />

      <Hero />

      {/* =========================================================
          PRODUCTS
      ========================================================= */}
      <section className="bg-white py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          <p className="text-center uppercase tracking-[0.35em] text-xs italic text-gray-400">
            Signature Collection
          </p>

          <h2 className="mt-4 mb-4 text-center text-4xl sm:text-5xl font-serif text-[#1A1A1A]">
            Discover Our Fragrances
          </h2>

          <p className="max-w-2xl mx-auto text-center text-gray-500 leading-8 mb-16 sm:mb-24">
            Every fragrance is crafted with exceptional ingredients, timeless
            elegance and refined craftsmanship. Discover scents designed to leave a
            lasting impression.
          </p>

          {/* =====================================================
              PRODUCT GRID

              PHONE  → 2 PRODUCTS PER ROW
              TABLET → 2 PRODUCTS PER ROW
              LAPTOP → 3 PRODUCTS PER ROW
              LARGE PC → 4 PRODUCTS PER ROW
          ===================================================== */}
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-x-3
              sm:gap-x-6
              lg:gap-x-10
              xl:gap-x-12
              gap-y-12
              sm:gap-y-16
              lg:gap-y-20
              items-stretch
            "
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          OUR PHILOSOPHY SECTION
      ========================================================= */}
      <section className="bg-[#FAF9F6] text-black py-28 px-8 md:px-16 border-t border-stone-200">
        <div className="max-w-7xl mx-auto">

          {/* TOP EDITORIAL GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left Text Content */}
            <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-8">

              <span className="block text-[11px] font-medium uppercase tracking-[0.4em] text-stone-400">
                Our Philosophy
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 leading-[1.12] font-light tracking-tight">
                A Scent That <br className="hidden md:block" />
                <span className="italic font-normal">
                  Defines Your Presence
                </span>
              </h2>

              <div className="space-y-4 text-stone-600 text-sm md:text-base font-light leading-relaxed max-w-xl pt-2">

                <p>
                  Born from rare ingredients and timeless traditions, every
                  creation tells a story of elegance, character, and emotion.
                </p>

                <p>
                  <strong className="font-medium text-stone-900 uppercase tracking-wide">
                    AVERNUS PARFUMS
                  </strong>{" "}
                  transforms memories into unforgettable fragrances crafted for those
                  who appreciate the extraordinary.
                </p>

              </div>

              {/* Signature & CTA */}
              <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-stone-200">

                <div>
                  <p className="font-serif italic text-lg text-stone-800">
                    Avernus Parfums
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mt-0.5">
                    Master Perfumers
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] font-medium text-stone-900 border-b border-stone-900 pb-1.5 hover:text-stone-500 hover:border-stone-400 transition-colors group cursor-pointer w-fit"
                >
                  <span>Discover The Craft</span>

                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

              </div>
            </div>

            {/* Right Visual Asset */}
            <div className="lg:col-span-5 relative">

              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm shadow-2xl bg-stone-200">

                <img
                  src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80"
                  alt="Perfume Bottle Craftsmanship"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                />

                <div className="absolute inset-0 bg-black/5" />

              </div>
            </div>

          </div>

          {/* BOTTOM PILLARS BAR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-24 pt-12 border-t border-stone-200/80">

            <div className="flex items-start gap-4">

              <Droplets
                className="w-5 h-5 text-stone-800 mt-1 shrink-0"
                strokeWidth={1.25}
              />

              <div>

                <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900 mb-1.5">
                  Rare Raw Accords
                </h3>

                <p className="text-xs text-stone-500 leading-relaxed font-light">
                  Sourced sustainably from historic flower fields and artisan
                  distilleries worldwide.
                </p>

              </div>
            </div>

            <div className="flex items-start gap-4">

              <Sparkles
                className="w-5 h-5 text-stone-800 mt-1 shrink-0"
                strokeWidth={1.25}
              />

              <div>

                <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900 mb-1.5">
                  Hand-Poured Quality
                </h3>

                <p className="text-xs text-stone-500 leading-relaxed font-light">
                  Blended in limited batches to guarantee depth, longevity, and
                  purity in every drop.
                </p>

              </div>
            </div>

            <div className="flex items-start gap-4">

              <Award
                className="w-5 h-5 text-stone-800 mt-1 shrink-0"
                strokeWidth={1.25}
              />

              <div>

                <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900 mb-1.5">
                  Signature Aesthetic
                </h3>

                <p className="text-xs text-stone-500 leading-relaxed font-light">
                  Housed in heavy-glass vintage-inspired vessels built to adorn
                  your personal collection.
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          TRY IT FIRST, LOVE IT FOREVER
      ========================================================= */}
      <section className="bg-white text-black py-24 px-8 md:px-16 border-b border-stone-200">

        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* LEFT TEXT CONTENT */}
            <div className="lg:col-span-7 space-y-6 pr-0 lg:pr-12">

              <span className="block text-[11px] font-semibold uppercase tracking-[0.35em] text-[#B08D57]">
                Discovery Experience
              </span>

              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-stone-900 leading-[1.25] font-light tracking-tight uppercase">
                TRY IT FIRST, <br />
                <span className="italic font-normal">
                  LOVE IT FOREVER
                </span>
              </h2>

              <div className="space-y-4 pt-2 text-stone-600 text-sm md:text-base font-light leading-relaxed">

                <p>
                  Every scent tells a story, revealed softly through time. A 2 ml sample accompanies each full-size bottle, inviting you to explore before you decide.
                </p>

                <p>
                  Trust your senses, follow your instinct, let the fragrance become part of you.
                </p>

                <p className="text-xs uppercase tracking-[0.18em] text-stone-400 font-medium pt-1">
                  Available according to availability.
                </p>

              </div>

              {/* Action Button */}
              <div className="pt-6">

                <button
                  type="button"
                  className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] font-semibold text-stone-900 border-b border-stone-900 pb-2 hover:text-[#B08D57] hover:border-[#B08D57] transition-all group cursor-pointer"
                >
                  <span>EXPLORE YOUR SCENT</span>

                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

              </div>

            </div>

            {/* RIGHT INVERTED DUAL-IMAGE DISPLAY */}
            <div className="lg:col-span-5 relative py-6">

              <div className="relative w-full h-[460px] flex items-center justify-center">

                {/* Main Vintage Bottle */}
                <div className="absolute top-0 right-0 w-3/4 h-[360px] overflow-hidden rounded-sm shadow-xl bg-stone-100">

                  <img
                    src="/sample.jpg"
                    alt="Vintage Bottle Collection"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                  />

                  <div className="absolute inset-0 bg-black/5" />

                </div>

                {/* Discovery Vial */}
                <div className="absolute bottom-0 left-0 w-3/5 h-[260px] overflow-hidden rounded-sm shadow-2xl border-4 border-white bg-stone-200 transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-10">

                  <img
                    src="/sample2.jpg"
                    alt="2ml Fragrance Discovery Vial"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                  />

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          NEWSLETTER
      ========================================================= */}
      <section className="bg-white py-28 border-t">

        <div className="max-w-3xl mx-auto text-center px-6">

          <p className="uppercase tracking-[0.35em] text-xs text-gray-400">
            Stay Connected
          </p>

          <h2 className="mt-4 text-4xl font-serif">
            Join Our Newsletter
          </h2>

          <p className="mt-6 text-gray-500">
            Receive exclusive launches and private offers directly to your
            inbox.
          </p>

          <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">

            <input
              type="email"
              placeholder="Your Email Address"
              className="border border-gray-300 px-6 py-4 w-full md:w-[420px] outline-none focus:border-black"
            />

            <button className="bg-black text-white uppercase tracking-[0.2em] px-10 py-4 hover:bg-[#B08D57] transition">
              Subscribe
            </button>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default Home;