import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

function Women() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://avernus-api.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        const all = data.products || [];

        const womenProducts = all.filter(
          (product) => product.category?.trim().toLowerCase() === "women"
        );

        setProducts(womenProducts);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <img
          src="/women.jpg"
          alt="Women Collection"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4">
          <p className="uppercase tracking-[0.5em] text-xs md:text-sm mb-6 font-light text-white/80">
            THE VINTAGE BOUTIQUE
          </p>

          <h1 className="font-serif font-light uppercase text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.25em] leading-none text-white drop-shadow-md select-none">
            WOMEN
          </h1>

          <div className="w-16 h-[1px] bg-white/70 my-8"></div>

          <p className="uppercase tracking-[0.4em] text-xs md:text-sm text-white/90 font-light">
            Discover Feminine Fragrances
          </p>
        </div>
      </section>

      {/* PRODUCTS - same ProductCard component as Home. */}
      <section className="px-8 md:px-16 py-24">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="font-serif text-4xl">No Women's Products Found</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20 items-stretch">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default Women;