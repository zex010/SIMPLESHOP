import { useNavigate } from "react-router-dom";
import { Heart, X, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShop } from "../context/ShopContext";

const FALLBACK_IMAGE = "https://placehold.co/400x400/f5f5f4/78716c?text=No+Image";

// Wishlist items may carry a single `image` string (raw catalogue products)
// or an `images` array (products normalized on the ProductDetails page) —
// handle both, same pattern used in Checkout/MyOrders.
function resolveImageSrc(product) {
  const src = product?.image || product?.images?.[0];
  if (!src) return FALLBACK_IMAGE;
  return src.startsWith("http") ? src : `http://192.168.1.6:5000/${src.replace(/^\/+/, "")}`;
}

function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, addToCart } = useShop();

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!addToCart) return;

    // Wishlist items can come straight from the catalogue with no size
    // chosen yet — the Order model requires one, so default to the
    // standard 100ML bottle (the app's base/unmultiplied price) rather
    // than sending a sizeless item that will fail order validation.
    const cartProduct = {
      ...product,
      _id: product._id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image || product.images?.[0],
      selectedSize: product.selectedSize || "100ML",
      qty: 1,
    };

    addToCart(cartProduct);
  };

  const handleRemove = (e, id) => {
    e.stopPropagation();
    if (removeFromWishlist) removeFromWishlist(id);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[50vh] flex items-center justify-center border-b border-stone-100">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-stone-500 mb-8">
            AVERNUS
          </p>
          <h1 className="font-serif text-6xl md:text-8xl tracking-[0.15em]">
            WISHLIST
          </h1>
          <p className="mt-8 text-stone-500 tracking-[0.3em] uppercase text-sm">
            Fragrances You're Considering
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 md:px-16 py-20">
        {!wishlist || wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart size={40} strokeWidth={1} className="text-stone-300 mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl">
              Your Wishlist Is Empty
            </h2>
            <p className="mt-4 text-stone-500 max-w-md">
              Save the fragrances you love and come back to them whenever
              you're ready.
            </p>
            <button
              onClick={() => navigate("/collection")}
              className="mt-10 bg-black text-white px-10 py-4 uppercase tracking-[0.35em] text-xs hover:bg-stone-800 transition"
            >
              Explore The Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
            {wishlist.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group cursor-pointer"
              >
                <div className="relative w-full h-[420px] overflow-hidden bg-[#f8f8f8]">
                  <button
                    onClick={(e) => handleRemove(e, product._id)}
                    aria-label="Remove from wishlist"
                    className="absolute top-5 right-5 z-20 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-black hover:text-white transition"
                  >
                    <X size={16} />
                  </button>
                  <img
                    src={resolveImageSrc(product)}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
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
                    className="w-full mt-8 flex items-center justify-center gap-3 bg-black text-white py-4 uppercase tracking-[0.35em] text-xs transition-all duration-300 hover:bg-stone-800"
                  >
                    <ShoppingBag size={14} />
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

export default Wishlist;