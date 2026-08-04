import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Women() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://192.168.1.6:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const womenProducts = data.products.filter(
          (product) => product.category?.toLowerCase() === "women"
        );

        setProducts(womenProducts);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    console.log("Added:", product.name);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src="/women.jpg"
          alt="Women Collection"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Text Container */}
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

      {/* PRODUCTS */}
      <section className="px-8 md:px-16 py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
          {products.map((product) => (
            <div
              key={product._id}
              className="group cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="relative">
                {product.isNew && (
                  <span className="absolute top-5 left-5 z-20 bg-white px-4 py-2 text-[10px] tracking-[0.45em] uppercase">
                    NEW ARRIVAL
                  </span>
                )}

                <div className="w-full h-[420px] overflow-hidden bg-[#f7f7f7]">
                  <img
                    src={`http://192.168.1.6:5000${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="text-center mt-8">
                <p className="uppercase text-[13px] tracking-[0.8em] text-gray-400 mb-4">
                  FEMININE
                </p>

                <p className="uppercase tracking-[0.45em] text-[11px] text-gray-500">
                  {product.brand}
                </p>

                <h2 className="font-serif text-[30px] mt-3">{product.name}</h2>

                <p className="mt-4 tracking-[0.3em] text-sm">
                  ${product.price}
                </p>

                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full mt-8 bg-black text-white py-4 uppercase tracking-[0.45em] text-xs hover:bg-neutral-800 transition"
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

export default Women;