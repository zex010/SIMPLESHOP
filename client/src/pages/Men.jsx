
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const API_URL =
  "https://avernus-api.onrender.com/api";

function Men() {
  const [products, setProducts] = useState([]);
  const [hero, setHero] = useState(null);

  // ==========================
  // LOAD MEN PRODUCTS
  // ==========================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/products`
        );

        const data = await response.json();

        const allProducts = data.products || [];

        const menProducts = allProducts.filter(
          (product) =>
            product.category &&
            product.category.trim().toLowerCase() === "men"
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

  // ==========================
  // LOAD MEN HERO
  // ==========================

  useEffect(() => {
    const loadHero = async () => {
      try {
        const response = await fetch(
          `${API_URL}/hero-sections/men`
        );

        const data = await response.json();

        console.log(
          "MEN HERO API RESPONSE:",
          data
        );

        // Backend returns:
        // {
        //   success: true,
        //   section: {...}
        // }

        if (data.success && data.section) {
          console.log(
            "MEN HERO IMAGE:",
            data.section.imageUrl
          );

          setHero(data.section);
        } else {
          console.warn(
            "No active Men hero section found.",
            data
          );
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

  // ==========================
  // HERO IMAGE
  // ==========================

  const heroImage =
    hero?.imageUrl || "/men.jpg";

  // ==========================
  // PAGE
  // ==========================

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
            {hero?.subtitle ||
              "THE VINTAGE BOUTIQUE"}
          </p>

          <h1 className="font-serif text-7xl tracking-[0.15em]">
            {hero?.title || "MEN"}
          </h1>

          <p className="mt-8 uppercase tracking-[0.35em] text-sm">
            {hero?.description ||
              "Discover Masculine Fragrances"}
          </p>
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
              Check that your database contains
              category: "Men"
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

