
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

  // ==========================
  // LOAD ALL PRODUCTS
  // ==========================

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

  // ==========================
  // LOAD COLLECTION HERO
  // ==========================

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
          console.log(
            "COLLECTION HERO IMAGE:",
            data.section.imageUrl
          );

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

  // ==========================
  // HERO IMAGE
  // ==========================

  const heroImage = hero?.imageUrl || "";

  // ==========================
  // RETURN
  // ==========================

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* ==========================
          HERO
      ========================== */}

      <section className="relative h-[70vh] flex items-center justify-center border-b border-stone-100 overflow-hidden">
        
        {/* HERO IMAGE */}

        {heroImage ? (
          <>
            <img
              src={heroImage}
              alt={hero?.title || "Collection"}
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={() => {
                console.log(
                  "COLLECTION HERO IMAGE LOADED:",
                  heroImage
                );
              }}
              onError={(error) => {
                console.error(
                  "COLLECTION HERO IMAGE FAILED:",
                  heroImage,
                  error
                );
              }}
            />

            {/* DARK OVERLAY */}

            <div className="absolute inset-0 bg-black/40"></div>
          </>
        ) : (
          /* FALLBACK BACKGROUND */

          <div className="absolute inset-0 bg-white"></div>
        )}

        {/* ==========================
            HERO CONTENT
        ========================== */}

        <div
          className={`relative z-10 text-center px-6 ${
            heroImage ? "text-white" : "text-black"
          }`}
        >
          <p
            className={`text-xs uppercase tracking-[0.5em] mb-8 ${
              heroImage
                ? "text-white/80"
                : "text-stone-500"
            }`}
          >
            {hero?.subtitle || "A V E R N U S"}
          </p>

          <h1 className="font-serif text-6xl md:text-8xl tracking-[0.15em]">
            {hero?.title || "COLLECTION"}
          </h1>

          <p
            className={`mt-8 tracking-[0.3em] uppercase text-sm ${
              heroImage
                ? "text-white/90"
                : "text-stone-500"
            }`}
          >
            {hero?.description ||
              "Discover our complete fragrance library"}
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
              No Products Found
            </h2>

            <p className="mt-4 text-stone-500">
              No products are currently available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20 items-stretch">
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

