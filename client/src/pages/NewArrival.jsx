import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const API_URL =
  "https://avernus-api.onrender.com/api";

function NewArrival() {
  const [products, setProducts] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // LOAD NEW ARRIVAL PRODUCTS
  // =========================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/products`
        );

        const data = await response.json();

        const allProducts =
          data.products || [];

        const newProducts =
          allProducts.filter(
            (product) =>
              product.isNew === true
          );

        setProducts(newProducts);
      } catch (error) {
        console.error(
          "Products Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // =========================================================
  // LOAD NEW ARRIVALS HERO
  // =========================================================

  useEffect(() => {
    const loadHero = async () => {
      try {
        const response = await fetch(
          `${API_URL}/hero-sections/new-arrivals`
        );

        const data =
          await response.json();

        if (
          data.success &&
          data.section
        ) {
          setHero(data.section);
        }
      } catch (error) {
        console.error(
          "New Arrivals Hero Error:",
          error
        );
      }
    };

    loadHero();
  }, []);

  // =========================================================
  // HERO IMAGE
  // =========================================================

  const heroImage =
    hero?.imageUrl || null;

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* =====================================================
          HERO
          SPLIT SCREEN
          LEFT  = TEXT
          RIGHT = IMAGE
      ===================================================== */}

      <section
        className="
          relative
          w-full
          min-h-[calc(100svh-70px)]
          md:min-h-[calc(100vh-70px)]
          flex
          flex-col
          md:flex-row
          overflow-hidden
          bg-[#f7f6f3]
        "
      >

        {/* ===================================================
            LEFT — TEXT
        =================================================== */}

        <div
          className="
            w-full
            md:w-1/2
            min-h-[48vh]
            md:min-h-0
            flex
            items-center
            justify-center
            bg-[#f7f6f3]
            px-6
            sm:px-10
            md:px-12
            lg:px-20
            py-16
            md:py-10
          "
        >
          <div className="text-center max-w-xl">

            {/* SMALL LABEL */}

            <p
              className="
                uppercase
                tracking-[0.5em]
                text-[9px]
                sm:text-[10px]
                md:text-xs
                text-stone-400
                mb-6
                md:mb-8
              "
            >
              {hero?.subtitle ||
                "A V E R N U S"}
            </p>

            {/* =================================================
                TITLE
                NEW
                ARRIVAL
            ================================================= */}

            <h1
              className="
                font-serif
                font-normal
                uppercase
                text-5xl
                sm:text-6xl
                md:text-7xl
                lg:text-8xl
                xl:text-9xl
                leading-[0.85]
                tracking-[0.04em]
              "
            >
              <span className="block">
                NEW
              </span>

              <span className="block">
                ARRIVAL
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-8
                md:mt-10
                uppercase
                tracking-[0.25em]
                text-[9px]
                sm:text-[10px]
                md:text-xs
                text-stone-500
                leading-6
              "
            >
              {hero?.description ||
                "The Latest Additions To Our Collection"}
            </p>

            {/* SMALL DECORATIVE LINE */}

            <div
              className="
                mx-auto
                mt-8
                w-12
                h-px
                bg-stone-300
              "
            />

          </div>
        </div>

        {/* ===================================================
            RIGHT — IMAGE
        =================================================== */}

        <div
          className="
            relative
            w-full
            md:w-1/2
            min-h-[52vh]
            md:min-h-0
            overflow-hidden
            bg-stone-100
          "
        >

          {heroImage ? (
            <img
              src={heroImage}
              alt={
                hero?.title ||
                "New Arrival"
              }
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                object-center
                select-none
              "
              loading="eager"
              decoding="async"
              fetchPriority="high"
              draggable="false"
            />
          ) : (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-stone-100
              "
            >
              <p
                className="
                  uppercase
                  tracking-[0.4em]
                  text-[9px]
                  text-stone-400
                "
              >
                AVERNUS
              </p>
            </div>
          )}

        </div>

      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section
        className="
          px-6
          sm:px-8
          md:px-12
          lg:px-16
          py-16
          md:py-20
        "
      >
        {loading ? (
          <div className="py-20 text-center">
            <p
              className="
                uppercase
                tracking-[0.4em]
                text-[9px]
                text-stone-400
              "
            >
              Loading...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div
            className="
              text-center
              py-20
            "
          >
            <h2
              className="
                font-serif
                text-3xl
                md:text-4xl
                font-normal
              "
            >
              No New Arrivals Found
            </h2>

            <p
              className="
                mt-4
                text-xs
                text-stone-400
                tracking-wide
              "
            >
              Check back soon for our
              latest creations.
            </p>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-x-8
              lg:gap-x-10
              gap-y-16
              md:gap-y-20
              items-stretch
            "
          >
            {products.map(
              (product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  badge="NEW ARRIVAL"
                />
              )
            )}
          </div>
        )}
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />
    </div>
  );
}

export default NewArrival;