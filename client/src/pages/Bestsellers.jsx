import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const API_URL = "https://avernus-api.onrender.com/api";

function BestSellers() {
  const [products, setProducts] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================
  // LOAD BEST SELLER PRODUCTS
  // ==========================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);

        const data = await response.json();

        const allProducts = data.products || [];

        // Prefer products explicitly marked as best sellers.
        const flaggedProducts = allProducts.filter(
          (product) => product.isBestseller === true
        );

        let bestSellerProducts;

        if (flaggedProducts.length > 0) {
          bestSellerProducts = flaggedProducts;
        } else {
          // Fallback to rating if no products are marked
          // as best sellers.
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

  // ==========================
  // LOAD BEST SELLERS HERO
  // ==========================

  useEffect(() => {
    const loadHero = async () => {
      try {
        const response = await fetch(
          `${API_URL}/hero-sections/bestsellers`
        );

        const data = await response.json();

        console.log(
          "BEST SELLERS HERO API RESPONSE:",
          data
        );

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
        console.error(
          "Best Sellers Hero Error:",
          error
        );
      }
    };

    loadHero();
  }, []);

  // ==========================
  // HERO IMAGE
  // ==========================

  const heroImage = hero?.imageUrl || null;

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* ==========================
          HERO
      ========================== */}

      <section className="relative h-[70vh] flex items-center justify-center border-b border-stone-100 overflow-hidden">

        {/* HERO IMAGE */}

        {heroImage && (
          <>
            <img
              src={heroImage}
              alt={
                hero?.title ||
                "Best Sellers"
              }
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div
              className="
                absolute
                inset-0
                bg-black/40
              "
            ></div>
          </>
        )}

        {/* HERO CONTENT */}

        <div
          className={`
            relative
            z-10
            text-center
            px-6
            ${heroImage
              ? "text-white"
              : "text-black"
            }
          `}
        >
          {/* SUBTITLE */}

          <p
            className={`
              text-xs
              uppercase
              tracking-[0.5em]
              mb-8
              ${heroImage
                ? "text-white/80"
                : "text-stone-500"
              }
            `}
          >
            {hero?.subtitle ||
              "A V E R N U S"}
          </p>

          {/* TITLE */}

          <h1
            className="
              font-serif
              text-6xl
              md:text-8xl
              tracking-[0.15em]
              uppercase
            "
          >
            {hero?.title ||
              "BEST SELLERS"}
          </h1>

          {/* DIVIDER */}

          <div
            className={`
              w-16
              h-[1px]
              mx-auto
              my-8
              ${heroImage
                ? "bg-white/70"
                : "bg-black/30"
              }
            `}
          ></div>

          {/* DESCRIPTION */}

          <p
            className={`
              tracking-[0.3em]
              uppercase
              text-sm
              ${heroImage
                ? "text-white/90"
                : "text-stone-500"
              }
            `}
          >
            {hero?.description ||
              "Our Most Loved Fragrances"}
          </p>
        </div>
      </section>

      {/* ==========================
          PRODUCTS
      ========================== */}

      <section className="px-6 md:px-16 py-20">

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
          <div className="text-center py-20">
            <h2
              className="
                font-serif
                text-4xl
              "
            >
              No Best Sellers Found
            </h2>

            <p className="mt-4 text-stone-500">
              Add products to your Best Sellers collection.
            </p>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-x-10
              gap-y-20
              items-stretch
            "
          >
            {products.map(
              (product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  badge={`#${index + 1} BEST SELLER`}
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

export default BestSellers;