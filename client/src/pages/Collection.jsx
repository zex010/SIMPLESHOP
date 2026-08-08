import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Collection() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://192.168.10.6:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
      })
      .catch((error) => {
        console.log("Products Error:", error);
      });
  }, []);

  // Temporary Add to Cart Function
  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    // We'll connect this to the backend later
    console.log("Added to Cart:", product.name);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative h-[70vh] flex items-center justify-center border-b border-gray-100">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-500 mb-8">
            MAISON AVERNUS
          </p>

          <h1 className="font-serif text-6xl md:text-8xl tracking-[0.15em]">
            COLLECTION
          </h1>

          <p className="mt-8 text-gray-500 tracking-[0.3em] uppercase text-sm">
            Discover our complete fragrance library
          </p>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="px-6 md:px-16 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="group cursor-pointer"
            >
              {/* IMAGE */}
             {/* IMAGE */}{/* IMAGE */}
<div className="relative w-full h-[420px] overflow-hidden bg-[#f8f8f8]">
  {product.isNew && (
    <span className="absolute top-5 left-5 z-20 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.45em] shadow-sm">
      NEW ARRIVAL
    </span>
  )}

  <img
    src={`http://192.168.10.6:5000${product.image}`}
    alt={product.name}
    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
  />
</div>

              {/* DETAILS */}
              <div className="text-center mt-8">
                {/* CATEGORY */}
                <p className="uppercase text-[13px] tracking-[0.8em] text-gray-400 mb-4 font-light">
                  {product.category?.toLowerCase() === "women"
                    ? "FEMININE"
                    : product.category?.toLowerCase() === "men"
                    ? "MASCULINE"
                    : "UNISEX"}
                </p>

                {/* BRAND */}
                <p className="uppercase tracking-[0.45em] text-[11px] text-gray-500">
                  {product.brand}
                </p>

                {/* PRODUCT NAME */}
                <h2 className="font-serif text-[30px] mt-3 leading-tight transition-colors duration-300 group-hover:text-gray-600">
                  {product.name}
                </h2>

                {/* PRICE */}
                <p className="mt-4 tracking-[0.3em] text-sm text-gray-700">
                  ${product.price}
                </p>

                {/* ADD TO CART BUTTON */}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full mt-8 bg-black text-white py-4 uppercase tracking-[0.45em] text-xs transition-all duration-300 hover:bg-neutral-800 hover:tracking-[0.55em]"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Collection;