
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const API_URL =
  "https://avernus-api.onrender.com/api";

function Women() {
  const [products, setProducts] = useState([]);
  const [hero, setHero] = useState(null);

  // ==========================
  // LOAD WOMEN PRODUCTS
  // ==========================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/products`
        );

        const data = await response.json();

        const allProducts = data.products || [];

        const womenProducts = allProducts.filter(
          (product) =>
            product.category &&
            product.category.trim().toLowerCase() ===
              "women"
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

  // ==========================
  // LOAD WOMEN HERO
  // ==========================

  useEffect(() => {
    const loadHero = async () => {
      try {
        const response = await fetch(
          `${API_URL}/hero-sections/women`
        );

        const data = await response.json();

        console.log(
          "WOMEN HERO API RESPONSE:",
          data
        );

        // Backend returns:
        // {
        //   success: true,
        //   section: {...}
        // }

        if (data.success && data.section) {
          console.log(
            "WOMEN HERO IMAGE:",
            data.section.imageUrl
          );

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

  // ==========================
  // HERO IMAGE
  // ==========================

  const heroImage =
    hero?.imageUrl || "/women.jpg";

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* ==========================
          HERO
      ========================== */}

      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt={
            hero?.title ||
            "Women Collection"
          }
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* OVERLAY */}

        <div className="absolute inset-0 bg-black/40"></div>

        {/* HERO CONTENT */}

        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4">
          <p className="uppercase tracking-[0.5em] text-xs md:text-sm mb-6 font-light text-white/80">
            {hero?.subtitle ||
              "THE VINTAGE BOUTIQUE"}
          </p>

          <h1 className="font-serif font-light uppercase text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.25em] leading-none text-white drop-shadow-md select-none">
            {hero?.title || "WOMEN"}
          </h1>

          <div className="w-16 h-[1px] bg-white/70 my-8"></div>

          <p className="uppercase tracking-[0.4em] text-xs md:text-sm text-white/90 font-light">
            {hero?.description ||
              "Discover Feminine Fragrances"}
          </p>
        </div>
      </section>

      {/* ==========================
          PRODUCTS
      ========================== */}

      <section className="px-8 md:px-16 py-24">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="font-serif text-4xl">
              No Women's Products Found
            </h2>
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

export default Women;

