import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Men() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("All Products:", data.products);

        const menProducts = data.products.filter(
          (product) =>
            product.category &&
            product.category.trim().toLowerCase() === "men"
        );

        console.log("Men Products:", menProducts);

        setProducts(menProducts);
      })
      .catch((error) => {
        console.log("Products Error:", error);
      });
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    console.log("Added:", product.name);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* HERO */}
      <section
        className="relative h-[75vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('/men.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center text-white">
          <p className="uppercase tracking-[0.6em] text-xs mb-8">
            THE VINTAGE BOUTIQUE
          </p>

          <h1 className="font-serif text-7xl tracking-[0.15em]">
            MEN
          </h1>

          <p className="mt-8 uppercase tracking-[0.35em] text-sm">
            Discover Masculine Fragrances
          </p>
        </div>
      </section>

      {/* PRODUCTS */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group cursor-pointer"
              >
                {/* IMAGE */}
                <div className="relative h-[380px] overflow-hidden bg-[#f8f8f8]">
                  {product.isNew && (
                    <span className="absolute top-4 left-4 z-10 bg-white px-3 py-1 text-[10px] tracking-[0.35em] uppercase shadow">
                      NEW ARRIVAL
                    </span>
                  )}

                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition duration-700 group-hover:scale-105"
                  />
                </div>

                {/* DETAILS */}
                <div className="text-center mt-7">
                  <p className="uppercase tracking-[0.7em] text-gray-400 text-sm">
                    MASCULINE
                  </p>

                  <p className="uppercase tracking-[0.35em] text-xs text-gray-500 mt-3">
                    {product.brand}
                  </p>

                  <h2 className="font-serif text-3xl mt-3">
                    {product.name}
                  </h2>

                  <p className="mt-4 tracking-[0.25em] text-sm">
                    ${product.price}
                  </p>

                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="mt-8 w-full bg-black text-white py-4 uppercase tracking-[0.35em] text-xs hover:bg-neutral-800 transition"
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

export default Men;