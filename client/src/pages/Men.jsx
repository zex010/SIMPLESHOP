import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const API_URL =
  "https://avernus-api.onrender.com/api";

function Men() {
  const [products, setProducts] = useState([]);
  const [hero, setHero] = useState(null);

  // =========================================================
  // LOAD MEN PRODUCTS
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

        const menProducts =
          allProducts.filter(
            (product) =>
              product.category &&
              product.category
                .trim()
                .toLowerCase() === "men"
          );

        setProducts(menProducts);
      } catch (error) {
        console.error(
          "Products Error:",
          error
        );
      }
    };

    loadProducts();
  }, []);

  // =========================================================
  // LOAD MEN HERO
  // =========================================================

  useEffect(() => {
    const loadHero = async () => {
      try {
        const response = await fetch(
          `${API_URL}/hero-sections/men`
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
          "Hero Section Error:",
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
    hero?.imageUrl || "/men.jpg";

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* =====================================================
          HERO
          
          MOBILE:
          IMAGE FIRST
          TEXT SECOND

          DESKTOP:
          TEXT LEFT
          IMAGE RIGHT
      ===================================================== */}

      <section
        className="
          relative
          w-full
          overflow-hidden
          bg-[#f7f6f3]
          flex
          flex-col
          md:flex-row
        "
      >

        {/* ===================================================
            HERO IMAGE

            MOBILE → FIRST
            DESKTOP → RIGHT
        =================================================== */}

        <div
          className="
            relative
            order-1
            md:order-2
            w-full
            md:w-1/2
            h-[55vh]
            sm:h-[60vh]
            md:h-[calc(100vh-70px)]
            min-h-[420px]
            md:min-h-0
            overflow-hidden
            bg-stone-100
          "
        >

          <img
            src={heroImage}
            alt="AVERNUS Men's Fragrance Collection"
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

        </div>

        {/* ===================================================
            HERO TEXT

            MOBILE → BELOW IMAGE
            DESKTOP → LEFT
        =================================================== */}

        <div
          className="
            order-2
            md:order-1
            w-full
            md:w-1/2
            min-h-[45vh]
            md:min-h-[calc(100vh-70px)]
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

          <div
            className="
              text-center
              max-w-xl
              w-full
            "
          >

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
                "THE HOUSE OF AVERNUS"}
            </p>

            {/* MAIN TITLE */}

            <h1
              className="
                font-serif
                font-normal
                uppercase
                text-6xl
                sm:text-7xl
                md:text-8xl
                lg:text-9xl
                xl:text-[10rem]
                leading-[0.85]
                tracking-[0.04em]
              "
            >
              {hero?.title || "MEN"}
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
                max-w-md
                mx-auto
              "
            >
              {hero?.description ||
                "Discover Masculine Fragrances"}
            </p>

            {/* DECORATIVE LINE */}

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

      </section>

      {/* =====================================================
          PRODUCTS
          PHONE → 2 PRODUCTS PER ROW
          TABLET → 2 PRODUCTS PER ROW
          LAPTOP → 4 PRODUCTS PER ROW
      ===================================================== */}

      <section
        id="men-collection"
        className="
          px-5
          sm:px-7
          md:px-12
          lg:px-16
          py-16
          md:py-20
        "
      >

        {/* COLLECTION HEADING */}

        <div
          className="
            max-w-7xl
            mx-auto
            mb-14
            md:mb-20
            text-center
          "
        >

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
            Men's Collection
          </h2>

        </div>

        {/* PRODUCTS */}

        {products.length === 0 ? (

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
              No Men's Products Found
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
              category: "Men"
            </p>

          </div>

        ) : (

          <div
            className="
              max-w-7xl
              mx-auto
              grid
              grid-cols-2
              sm:grid-cols-2
              lg:grid-cols-4
              gap-x-3
              sm:gap-x-6
              md:gap-x-10
              gap-y-12
              sm:gap-y-16
              md:gap-y-20
              items-stretch
            "
          >

            {products.map(
              (product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              )
            )}

          </div>

        )}

      </section>

      <Footer />
    </div>
  );
}

export default Men;