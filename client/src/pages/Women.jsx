import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const API_URL =
  "https://avernus-api.onrender.com/api";

function Women() {
  const [products, setProducts] = useState([]);
  const [hero, setHero] = useState(null);

  // ============================================================
  // LOAD WOMEN PRODUCTS
  // ============================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/products`
        );

        const data = await response.json();

        const allProducts =
          data.products || [];

        const womenProducts =
          allProducts.filter(
            (product) =>
              product.category &&
              product.category
                .trim()
                .toLowerCase() === "women"
          );

        setProducts(womenProducts);
      } catch (error) {
        console.error(
          "Products Error:",
          error
        );
      }
    };

    loadProducts();
  }, []);

  // ============================================================
  // LOAD WOMEN HERO
  // ============================================================

  useEffect(() => {
    const loadHero = async () => {
      try {
        const response = await fetch(
          `${API_URL}/hero-sections/women`
        );

        const data =
          await response.json();

        console.log(
          "WOMEN HERO API RESPONSE:",
          data
        );

        if (
          data.success &&
          data.section
        ) {
          setHero(data.section);
        } else {
          console.warn(
            "No active Women hero section found.",
            data
          );
        }
      } catch (error) {
        console.error(
          "Women Hero Error:",
          error
        );
      }
    };

    loadHero();
  }, []);

  // ============================================================
  // HERO IMAGE
  // ============================================================

  const heroImage =
    hero?.imageUrl || "/women.jpg";

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-black">
      <Navbar />

      {/* ========================================================
          HERO
      ======================================================== */}

      <section
        className="
          relative
          w-full
          min-h-[calc(100svh-64px)]
          md:min-h-[calc(100dvh-64px)]
          bg-[#f7f6f3]
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
              px-4
              sm:px-8
              md:px-12
              lg:px-20
              py-14
              md:py-20
              bg-[#f7f6f3]
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
                  sm:tracking-[0.55em]
                  text-[8px]
                  sm:text-[10px]
                  text-stone-400
                  mb-5
                "
              >
                {hero?.subtitle ||
                  "THE HOUSE OF AVERNUS"}
              </p>

              {/* =================================================
                  WOMEN TITLE

                  IMPORTANT:
                  - whitespace-nowrap keeps it on one line
                  - smaller sizes on small screens
              ================================================= */}

              <h1
                className="
                  font-serif
                  font-normal
                  uppercase
                  whitespace-nowrap
                  leading-none
                  tracking-[0.01em]
                  text-[2.45rem]
                  min-[360px]:text-[2.8rem]
                  min-[400px]:text-[3.2rem]
                  sm:text-6xl
                  md:text-6xl
                  lg:text-7xl
                  xl:text-8xl
                "
              >
                {hero?.title || "WOMEN"}
              </h1>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-7
                  w-full
                  max-w-md
                  mx-auto
                  md:mx-0
                  text-xs
                  sm:text-sm
                  leading-7
                  text-stone-500
                "
              >
                {hero?.description ||
                  "Discover a collection of refined feminine fragrances created with elegance, character and timeless beauty."}
              </p>

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
              h-[52vh]
              sm:h-[58vh]
              md:h-auto
              min-h-[420px]
              md:min-h-full
              bg-stone-100
              overflow-hidden
            "
          >

            <img
              src={heroImage}
              alt="AVERNUS Women's Fragrance Collection"
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
            />

            {/* LIGHT IMAGE OVERLAY */}

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
                  tracking-[0.35em]
                  text-[8px]
                  sm:text-[9px]
                "
              >
                AVERNUS
              </p>

              <p
                className="
                  mt-2
                  uppercase
                  tracking-[0.25em]
                  text-[8px]
                  text-white/70
                "
              >
                Women's Collection
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          PRODUCTS
      ======================================================== */}

      <section
        id="women-collection"
        className="
          px-5
          sm:px-7
          md:px-12
          lg:px-16
          py-16
          md:py-24
        "
      >

        {/* COLLECTION HEADING */}

        <div
          className="
            max-w-7xl
            mx-auto
            mb-14
            md:mb-20
            flex
            flex-col
            md:flex-row
            md:items-end
            md:justify-between
            gap-6
          "
        >

          <div>

            <p
              className="
                uppercase
                tracking-[0.45em]
                text-[9px]
                text-stone-400
                mb-4
              "
            >
              AVERNUS
            </p>

            <h2
              className="
                font-serif
                text-3xl
                sm:text-4xl
                md:text-5xl
                font-normal
                tracking-wide
              "
            >
              Women's Collection
            </h2>

          </div>

          <p
            className="
              max-w-sm
              text-xs
              leading-6
              text-stone-500
              md:text-right
            "
          >
            Explore compositions created around
            elegance, character and distinctive beauty.
          </p>

        </div>

        {/* ======================================================
            PRODUCTS
        ====================================================== */}

        {products.length === 0 ? (

          <div className="text-center py-20">

            <h2
              className="
                font-serif
                text-3xl
                md:text-4xl
                font-normal
              "
            >
              No Women's Products Found
            </h2>

            <p
              className="
                mt-4
                text-xs
                md:text-sm
                text-stone-500
              "
            >
              Check that your database contains
              category: "Women"
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

            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>

        )}

      </section>

      <Footer />
    </div>
  );
}

export default Women;