import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const API_URL = "https://avernus-api.onrender.com/api";

function Collection() {
  const [products, setProducts] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);

  // ============================================================
  // LOAD ALL PRODUCTS
  // ============================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        setProducts(data.products || []);
      } catch (error) {
        console.error("Collection Products Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ============================================================
  // LOAD COLLECTION HERO
  // ============================================================

  useEffect(() => {
    const loadHero = async () => {
      try {
        setHeroLoading(true);

        const response = await fetch(
          `${API_URL}/hero-sections/collection`
        );

        if (!response.ok) {
          throw new Error("Failed to load collection hero");
        }

        const data = await response.json();

        console.log("COLLECTION HERO RESPONSE:", data);

        if (data.success && data.section) {
          setHero(data.section);
        } else {
          console.warn(
            "No active Collection hero found:",
            data
          );
        }
      } catch (error) {
        console.error("Collection Hero Error:", error);
        setHero(null);
      } finally {
        setHeroLoading(false);
      }
    };

    loadHero();
  }, []);

  // ============================================================
  // HERO IMAGE
  // ============================================================

  const heroImage = hero?.imageUrl || "";

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      <Navbar />

      {/* ========================================================
          HERO
          LEFT  = TEXT
          RIGHT = IMAGE
          50 / 50 ON DESKTOP
      ======================================================== */}

      <section className="relative w-full overflow-hidden bg-[#f7f6f3]">
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            w-full
            min-h-[calc(100svh-64px)]
            md:min-h-[calc(100dvh-64px)]
          "
        >

          {/* ====================================================
              LEFT — TEXT
          ==================================================== */}

          <div
            className="
              order-2
              md:order-1
              flex
              items-center
              justify-center
              bg-[#f7f6f3]
              px-5
              sm:px-8
              md:px-10
              lg:px-14
              xl:px-20
              py-16
              sm:py-20
              md:py-10
              min-w-0
              overflow-hidden
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
                  text-[8px]
                  sm:text-[9px]
                  md:text-[10px]
                  text-stone-400
                  mb-4
                  sm:mb-5
                "
              >
                {hero?.subtitle || "THE HOUSE OF AVERNUS"}
              </p>

              {/* CATEGORY */}

              <p
                className="
                  uppercase
                  tracking-[0.28em]
                  text-[8px]
                  sm:text-[9px]
                  md:text-[10px]
                  text-stone-500
                  mb-4
                "
              >
                THE FRAGRANCE LIBRARY
              </p>

              {/* MAIN TITLE */}

              <h1
  className="
    font-serif
    font-normal
    text-[1.7rem]
    min-[360px]:text-[1.9rem]
    sm:text-4xl
    md:text-5xl
    lg:text-[3rem]
    xl:text-[3.4rem]
    leading-none
    tracking-[0.01em]
    whitespace-nowrap
    text-center
    lg:text-left
  "
>
  {hero?.title || "COLLECTION"}
</h1>
              {/* DESCRIPTION */}

              <p
                className="
                  mt-6
                  sm:mt-7
                  max-w-md
                  mx-auto
                  md:mx-0
                  text-[10px]
                  sm:text-xs
                  md:text-sm
                  leading-6
                  sm:leading-7
                  text-stone-500
                "
              >
                {hero?.description ||
                  "Discover our complete fragrance library, created with character, depth and timeless elegance."}
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
              order-1
              md:order-2
              relative
              w-full
              h-[52vh]
              sm:h-[58vh]
              md:h-auto
              min-h-[400px]
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
                  "AVERNUS Collection"
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
                    "COLLECTION HERO IMAGE LOADED:",
                    heroImage
                  );
                }}
                onError={(event) => {
                  console.error(
                    "COLLECTION HERO IMAGE FAILED:",
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

            {/* IMAGE OVERLAY */}

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
                left-5
                sm:left-7
                md:left-8
                bottom-5
                sm:bottom-7
                md:bottom-8
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
                Complete Collection
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

        {/* LOADING */}

        {loading ? (

          <p
            className="
              text-center
              py-20
              uppercase
              tracking-[0.4em]
              text-xs
              text-stone-400
            "
          >
            Loading...
          </p>

        ) : products.length === 0 ? (

          /* EMPTY STATE */

          <div className="text-center py-20 px-6">

            <h2
              className="
                font-serif
                text-3xl
                sm:text-4xl
                font-normal
              "
            >
              No Products Found
            </h2>

            <p className="mt-4 text-stone-500">
              No products are currently available.
            </p>

          </div>

        ) : (

          /* PRODUCTS */

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

            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                badge={
                  product.isNew
                    ? "NEW ARRIVAL"
                    : undefined
                }
              />
            ))}

          </div>

        )}

      </section>

      <Footer />
    </div>
  );
}

export default Collection;