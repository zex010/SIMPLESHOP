import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://avernus-api.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        const all = data.products || [];
        // Rank by rating when available, otherwise keep catalogue order,
        // and show the top slice as our "Best Sellers".
        const sorted = [...all].sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );
        setProducts(sorted.slice(0, 12));
      })
      .catch((error) => {
        console.log("Products Error:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    console.log("Added to Cart:", product.name);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[60vh] flex items-center justify-center border-b border-stone-100">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-stone-500 mb-8">
            THE VINTAGE BOUTIQUE
          </p>
          <h1 className="font-serif text-6xl md:text-8xl tracking-[0.15em]">
            BEST SELLERS
          </h1>
          <p className="mt-8 text-stone-500 tracking-[0.3em] uppercase text-sm">
            Our Most Loved Fragrances
          </p>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="px-6 md:px-16 py-20">
        {loading ? (
          <p className="text-center py-20 uppercase tracking-[0.4em] text-xs text-stone-400">
            Loading...
          </p>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="font-serif text-4xl">No Products Found</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
            {products.map((product, index) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group cursor-pointer"
              >
                <div className="relative w-full h-[420px] overflow-hidden bg-[#f8f8f8]">
                  <span className="absolute top-5 left-5 z-20 bg-black text-white px-3 py-1 text-[10px] uppercase tracking-[0.45em] shadow-sm">
                    #{index + 1} Best Seller
                  </span>
                  <img
                    src={`https://avernus-api.onrender.com${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="text-center mt-8">
                  <p className="uppercase tracking-[0.45em] text-[11px] text-stone-500">
                    {product.brand}
                  </p>
                  <h2 className="font-serif text-[30px] mt-3 leading-tight transition-colors duration-300 group-hover:text-stone-600">
                    {product.name}
                  </h2>
                  <p className="mt-4 tracking-[0.3em] text-sm text-stone-700">
                    ${product.price}
                  </p>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full mt-8 bg-black text-white py-4 uppercase tracking-[0.45em] text-xs transition-all duration-300 hover:bg-stone-800 hover:tracking-[0.55em]"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default BestSellers;