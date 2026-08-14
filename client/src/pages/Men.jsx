import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

function Men() {
  const [products, setProducts] = useState([]);
  const [hero, setHero] = useState(null);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://avernus-api.onrender.com/api";

  // ==========================
  // LOAD MEN PRODUCTS
  // ==========================

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        const all = data.products || [];

        const menProducts = all.filter(
          (product) =>
            product.category &&
            product.category.trim().toLowerCase() === "men"
        );

        setProducts(menProducts);
      })
      .catch((error) => {
        console.log("Products Error:", error);
      });
  }, [API_URL]);

  // ==========================
  // LOAD MEN HERO
  // ==========================

  useEffect(() => {
    fetch(`${API_URL}/hero-sections/men`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load Men hero");
        }

        return res.json();
      })
      .then((data) => {
        console.log("Men Hero:", data);

        if (data.success && data.section) {
          setHero(data.section);
        } else {
          setHero(null);
        }
      })
      .catch((error) => {
        console.log("Hero Error:", error);
        setHero(null);
      });
  }, [API_URL]);

  // ==========================
  // HERO VALUES
  // ==========================

  const heroImage = hero?.imageUrl || "/men.jpg";

  const heroTitle = hero?.title || "MEN";

  const heroSubtitle =
    hero?.subtitle || "Discover Masculine Fragrances";

  const heroDescription =
    hero?.description || "";

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* ==========================
          HERO
      ========================== */}

      <section
        className="relative h-[75vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url("${heroImage}")`,
        }}
      >
        {/* OVERLAY */}

        <div className="absolute inset-0 bg-black/40"></div>

        {/* HERO CONTENT */}

        <div className="relative z-10 text-center text-white px-6">
          <p className="uppercase tracking-[0.6em] text-xs mb-8">
            AVERNUS
          </p>

          <h1 className="font-serif text-6xl md:text-7xl tracking-[0.15em]">
            {heroTitle}
          </h1>

          {heroSubtitle && (
            <p className="mt-8 uppercase tracking-[0.35em] text-sm">
              {heroSubtitle}
            </p>
          )}

          {heroDescription && (
            <p className="mt-5 max-w-2xl mx-auto text-sm md:text-base leading-7 text-white/90">
              {heroDescription}
            </p>
          )}
        </div>
      </section>

      {/* ==========================
          PRODUCTS
      ========================== */}

      <section className="px-6 md:px-16 py-20">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="font-serif text-4xl">
              No Men's Products Found
            </h2>

            <p className="mt-4 text-gray-500">
              Check that your database contains category: "Men"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20 items-stretch">
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

export default Men;