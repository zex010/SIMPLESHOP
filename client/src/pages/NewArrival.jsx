
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

  // ==========================
  // LOAD NEW ARRIVAL PRODUCTS
  // ==========================

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

  // ==========================
  // LOAD NEW ARRIVALS HERO
  // ==========================

  useEffect(() => {
    const loadHero = async () => {
      try {
        const response = await fetch(
          `${API_URL}/hero-sections/new-arrivals`
        );

        const data =
          await response.json();

        console.log(
          "NEW ARRIVALS HERO API RESPONSE:",
          data
        );

        if (
          data.success &&
          data.section
        ) {
          console.log(
            "NEW ARRIVALS HERO IMAGE:",
            data.section.imageUrl
          );

          setHero(data.section);
        } else {
          console.warn(
            "No active New Arrivals hero section found.",
            data
          );
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

  // ==========================
  // HERO IMAGE
  // ==========================

  const heroImage =
    hero?.imageUrl || null;

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
                "New Arrivals"
              }
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40"></div>
          </>
        )}

        {/* HERO CONTENT */}

        <div
          className={`relative z-10 text-center px-6 ${
            heroImage
              ? "text-white"
              : "text-black"
          }`}
        >
          <p
            className={`text-xs uppercase tracking-[0.5em] mb-8 ${
              heroImage
                ? "text-white/80"
                : "text-stone-500"
            }`}
          >
            {hero?.subtitle ||
              "A V E R N U S"}
          </p>

          <h1 className="font-serif text-6xl md:text-8xl tracking-[0.15em]">
            {hero?.title ||
              "NEW ARRIVALS"}
          </h1>

          <p
            className={`mt-8 tracking-[0.3em] uppercase text-sm ${
              heroImage
                ? "text-white/90"
                : "text-stone-500"
            }`}
          >
            {hero?.description ||
              "The Latest Additions To Our Collection"}
          </p>
        </div>
      </section>

      {/* ==========================
          PRODUCTS
      ========================== */}

      <section className="px-6 md:px-16 py-20">
        {loading ? (
          <p className="text-center py-20 uppercase tracking-[0.4em] text-xs text-stone-400">
            Loading...
          </p>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="font-serif text-4xl">
              No New Arrivals Found
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20 items-stretch">
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

      <Footer />
    </div>
  );
}

export default NewArrival;

