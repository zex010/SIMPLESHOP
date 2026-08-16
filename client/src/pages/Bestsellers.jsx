import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const API_URL = "https://avernus-api.onrender.com/api";

function BestSellers() {
  const [products, setProducts] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // LOAD BEST SELLER PRODUCTS
  // ============================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        const allProducts = data.products || [];

        // Prefer products explicitly marked as best sellers
        const flaggedProducts = allProducts.filter(
          (product) => product.isBestseller === true
        );

        let bestSellerProducts;

        if (flaggedProducts.length > 0) {
          bestSellerProducts = flaggedProducts;
        } else {
          // Fallback to rating
          bestSellerProducts = [...allProducts].sort(
            (a, b) => (b.rating || 0) - (a.rating || 0)
          );
        }

        setProducts(bestSellerProducts.slice(0, 12));
      } catch (error) {
        console.error("Products Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ============================================================
  // LOAD BEST SELLERS HERO
  // ============================================================

  useEffect(() => {
    const loadHero = async () => {
      try {
        const response = await fetch(
          `${API_URL}/hero-sections/bestsellers`
        );

        if (!response.ok) {
          throw new Error("Failed to load Best Sellers hero");
        }

        const data = await response.json();

        console.log("BEST SELLERS HERO RESPONSE:", data);

        if (data.success && data.section) {
          console.log(
            "BEST SELLERS HERO IMAGE:",
            data.section.imageUrl
          );

          setHero(data.section);
        } else {
          console.warn(
            "No active Best Sellers hero section found.",
            data
          );
        }
      } catch (error) {
        console.error("Best Sellers Hero Error:", error);
        setHero(null);
      }
    };

    loadHero();
  }, []);

  // ============================================================
  // HERO IMAGE
  // ============================================================

  const heroImage = hero?.imageUrl || "";

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      <Navbar />

      {/* ========================================================
          HERO — 50 / 50 LAYOUT
      ======================================================== */}

      <section
        className="
          relative
          w-full
          min-h-[calc(100svh-64px)]
          md:min-h-[calc(100dvh-64px)]
          bg-white
          overflow-hidden
        "
      >
        <div
          className="
            min-h-[calc(100svh-64px)]
            md:min-h-[calc(100dvh-64px)]
            grid
            grid-cols-1
            md:grid-cols-2
          "
        >
          {/* ====================================================
              LEFT — TEXT
          ==================================================== */}

          <div
            className="
              relative
              flex
              items-center
              justify-center
              order-2
              md:order-1
              px-5
              sm:px-8
              md:px-10
              lg:px-14
              xl:px-20
              py-14
              sm:py-16
              md:py-20
              bg-white
              overflow-hidden
              min-w-0
            "
          >
            <div
              className="
                w-full
                max-w-xl
                min-w-0
                text-center
                md:text-left
              "
            >
              {/* SMALL LABEL */}

              <p
                className="
                  uppercase
                  tracking-[0.45em]
                  sm:tracking-[0.5em]
                  text-[8px]
                  sm:text-[9px]
                  md:text-[10px]
                  text-stone-400
                  mb-4
                  sm:mb-5
                  whitespace-nowrap
                "
              >
                {hero?.subtitle || "THE HOUSE OF AVERNUS"}
              </p>

              {/* CATEGORY */}

              <p
                className="
                  uppercase
                  tracking-[0.25em]
                  sm:tracking-[0.3em]
                  text-[8px]
                  sm:text-[9px]
                  md:text-[10px]
                  text-stone-500
                  mb-4
                  whitespace-nowrap
                "
              >
                THE MOST LOVED FRAGRANCES
              </p>

              {/* ==================================================
                  MAIN TITLE

                  BEST
                  SELLERS

                  Two lines on every device.
                  Font automatically scales.
              ================================================== */}

              <h1
                className="
                  font-serif
                  font-normal
                  uppercase
                  leading-[0.88]
                  tracking-[0.015em]
                  sm:tracking-[0.02em]
                  md:tracking-[0.025em]
                  text-[clamp(3rem,8vw,6.5rem)]
                  sm:text-[clamp(3.5rem,7vw,6.5rem)]
                  md:text-[clamp(3.2rem,5.2vw,6.5rem)]
                  lg:text-[clamp(4rem,5vw,6.5rem)]
                  whitespace-normal
                  break-words
                  max-w-full
                "
              >
                <span className="block">
                  BEST
                </span>

                <span className="block">
                  SELLERS
                </span>
              </h1>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-6
                  sm:mt-7
                  max-w-md
                  mx-auto
                  md:mx-0
                  text-[11px]
                  sm:text-xs
                  md:text-sm
                  leading-6
                  sm:leading-7
                  text-stone-500
                "
              >
                {hero?.description ||
                  "Discover the fragrances that have become the most loved creations of AVERNUS."}
              </p>

              {/* DECORATIVE LINE */}

              <div
                className="
                  flex
                  items-center
                  justify-center
                  md:justify-start
                  gap-4
                  mt-7
                  sm:mt-8
                "
              >
                <span className="w-8 sm:w-10 h-px bg-black" />

                <span
                  className="
                    uppercase
                    tracking-[0.3em]
                    text-[7px]
                    sm:text-[8px]
                    text-stone-400
                  "
                >
                  AVERNUS
                </span>
              </div>
            </div>
          </div>

          {/* ====================================================
              RIGHT — HERO IMAGE
          ==================================================== */}

          <div
            className="
              relative
              order-1
              md:order-2
              h-[48vh]
              sm:h-[55vh]
              md:h-auto
              min-h-[360px]
              sm:min-h-[420px]
              md:min-h-full
              bg-stone-100
              overflow-hidden
            "
          >
            {heroImage ? (
              <img
                src={heroImage}
                alt={
                  hero?.title ||
                  "AVERNUS Best Sellers"
                }
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  object-center
                  select-none
                "
                draggable="false"
                onLoad={() => {
                  console.log(
                    "BEST SELLERS HERO IMAGE LOADED:",
                    heroImage
                  );
                }}
                onError={(event) => {
                  console.error(
                    "BEST SELLERS HERO IMAGE FAILED:",
                    heroImage
                  );

                  event.currentTarget.style.display =
                    "none";
                }}
              />
            ) : (
              <div
                className="
                  absolute
                  inset-0
                  bg-stone-100
                "
              />
            )}

            {/* VERY LIGHT IMAGE OVERLAY */}

            {heroImage && (
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/10
                  via-transparent
                  to-transparent
                  pointer-events-none
                "
              />
            )}

            {/* IMAGE LABEL */}

            <div
              className="
                absolute
                left-4
                sm:left-6
                md:left-7
                lg:left-8
                bottom-4
                sm:bottom-6
                md:bottom-7
                lg:bottom-8
                text-white
              "
            >
              <p
                className="
                  uppercase
                  tracking-[0.3em]
                  text-[7px]
                  sm:text-[8px]
                  md:text-[9px]
                "
              >
                AVERNUS
              </p>

              <p
                className="
                  mt-1.5
                  sm:mt-2
                  uppercase
                  tracking-[0.2em]
                  text-[7px]
                  sm:text-[8px]
                  text-white/70
                "
              >
                Best Sellers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PRODUCTS
      ======================================================== */}

      <section
        className="
          px-5
          sm:px-7
          md:px-12
          lg:px-16
          py-16
          md:py-24
        "
      >
        {loading ? (
          <p
            className="
              text-center
              py-20
              uppercase
              tracking-[0.4em]
              text-[10px]
              sm:text-xs
              text-stone-400
            "
          >
            Loading...
          </p>
        ) : products.length === 0 ? (
          <div className="text-center py-20 px-5">
            <h2
              className="
                font-serif
                text-3xl
                sm:text-4xl
                font-normal
              "
            >
              No Best Sellers Found
            </h2>

            <p className="mt-4 text-sm text-stone-500">
              Add products to your Best Sellers collection.
            </p>
          </div>
        ) : (
          <div
            className="
              max-w-7xl
              mx-auto
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-x-8
              md:gap-x-10
              gap-y-16
              md:gap-y-20
              items-stretch
            "
          >
            {products.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                badge={`#${index + 1} BEST SELLER`}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default BestSellers;