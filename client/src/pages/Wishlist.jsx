
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShop } from "../context/ShopContext";

const API_HOST = "https://avernus-api.onrender.com";

function Wishlist() {
  const navigate = useNavigate();

  const {
    wishlist,
    removeFromWishlist,
    addToCart,
  } = useShop();

  // ============================================================
  // IMAGE RESOLVER
  // Same logic as ProductCard
  // ============================================================

  const resolveImage = (src) => {
    if (!src || typeof src !== "string") {
      return "/placeholder.png";
    }

    const cleanSrc = src.trim();

    if (!cleanSrc) {
      return "/placeholder.png";
    }

    // Cloudflare R2 / complete URL
    if (/^https?:\/\//i.test(cleanSrc)) {
      return cleanSrc;
    }

    // Old Render/backend image path
    return `${API_HOST}${cleanSrc.startsWith("/") ? "" : "/"}${cleanSrc}`;
  };

  // ============================================================
  // CATEGORY LABEL
  // Same as ProductCard
  // ============================================================

  const getCategoryLabel = (category) => {
    const normalized = (category || "").trim().toLowerCase();

    if (normalized === "men") return "MASCULINE";
    if (normalized === "women") return "FEMININE";

    return "UNISEX";
  };

  // ============================================================
  // DISPLAY NAME
  // Same as ProductCard
  // ============================================================

  const getDisplayName = (name) => {
    if (!name || typeof name !== "string") {
      return "Avernus Fragrance";
    }

    return name
      .replace(/\s*pour\s+femme\s*/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // ============================================================
  // REMOVE FROM WISHLIST
  // ============================================================

  const handleRemove = (event, productId) => {
    event.preventDefault();
    event.stopPropagation();

    if (removeFromWishlist) {
      removeFromWishlist(productId);
    }
  };

  // ============================================================
  // ADD TO BAG
  // Same behavior as ProductCard
  // ============================================================

  const handleAddToCart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    if (!addToCart) return;

    addToCart(product);
  };

  // ============================================================
  // BUY NOW
  // Same behavior as ProductCard
  // ============================================================

  const handleBuyNow = (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    if (!addToCart) return;

    addToCart(product);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* ========================================================
          HERO
      ======================================================== */}
<section className="relative h-[70vh] flex items-center justify-center overflow-hidden">

  {/* WISHLIST HERO IMAGE */}
  <img
    src="/wishlist.jpg"
    alt="Wishlist"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* HERO CONTENT */}
  <div className="relative z-10 text-center text-white px-6">

    <p className="text-xs uppercase tracking-[0.5em] text-white/80 mb-8">
      AVERNUS
    </p>

    <h1 className="font-serif text-6xl md:text-8xl tracking-[0.15em]">
      WISHLIST
    </h1>

    <p className="mt-8 text-white/90 tracking-[0.3em] uppercase text-sm">
      Fragrances You're Considering
    </p>

  </div>
</section>
      

      {/* ========================================================
          PRODUCTS
      ======================================================== */}

      <section className="px-6 md:px-16 py-20">
        {!wishlist || wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart
              size={40}
              strokeWidth={1}
              className="text-stone-300 mb-6"
            />

            <h2 className="font-serif text-4xl">
              Your Wishlist Is Empty
            </h2>

            <p className="mt-4 text-stone-500 max-w-md">
              Save the fragrances you love and come back to them whenever
              you're ready.
            </p>

            <button
              type="button"
              onClick={() => navigate("/collection")}
              className="
                mt-10
                bg-black
                text-white
                px-10
                py-4
                uppercase
                tracking-[0.35em]
                text-xs
                hover:bg-stone-800
                transition
              "
            >
              Explore The Collection
            </button>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-x-10
              gap-y-20
              items-stretch
            "
          >
            {wishlist.map((product) => {
              const imageUrl = resolveImage(product?.image);
              const category = getCategoryLabel(product?.category);
              const displayName = getDisplayName(product?.name);

              return (
                <article
                  key={product._id}
                  className="
                    group
                    flex
                    h-full
                    min-h-full
                    flex-col
                    bg-white
                    text-black
                    cursor-pointer
                  "
                  onClick={() =>
                    navigate(`/product/${product._id}`)
                  }
                >
                  {/* ==================================================
                      PRODUCT IMAGE
                  ================================================== */}

                  <div className="relative aspect-square w-full overflow-hidden bg-[#F8F7F4]">
                    {/* REMOVE FROM WISHLIST */}

                    <button
                      onClick={(e) => handleRemove(e, product._id)}
                      aria-label="Remove from wishlist"
                      className="
    absolute
    top-4
    right-4
    z-20
    flex
    items-center
    justify-center
    bg-transparent
    text-black
    transition-all
    duration-300
    hover:scale-110
    hover:text-red-600
  "
                    >
                      <Trash2
                        size={19}
                        strokeWidth={1.4}
                      />
                    </button>

                    <img
                      src={imageUrl}
                      alt={
                        product?.name ||
                        "Avernus fragrance"
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                        object-center
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-[1.035]
                      "
                      onError={(event) => {
                        if (
                          !event.currentTarget.src.includes(
                            "placeholder.png"
                          )
                        ) {
                          event.currentTarget.src =
                            "/placeholder.png";
                        }
                      }}
                    />
                  </div>

                  {/* ==================================================
                      PRODUCT INFORMATION
                  ================================================== */}

                  <div
                    className="
                      flex
                      flex-1
                      flex-col
                      pt-6
                    "
                  >
                    {/* NEW ARRIVAL */}

                    <div
                      className="
                        flex
                        h-[20px]
                        shrink-0
                        items-start
                        justify-center
                      "
                    >
                      {product?.isNew && (
                        <span
                          className="
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-[0.3em]
                            text-stone-400
                          "
                        >
                          NEW ARRIVAL
                        </span>
                      )}
                    </div>

                    {/* BRAND + CATEGORY */}

                    <div
                      className="
                        mt-3
                        flex
                        h-[18px]
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        text-center
                      "
                    >
                      <span
                        className="
                          text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.25em]
                          text-stone-500
                        "
                      >
                        {product?.brand || "AVERNUS"}
                      </span>

                      <span className="text-[10px] text-stone-300">
                        |
                      </span>

                      <span
                        className="
                          text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.25em]
                          text-stone-400
                        "
                      >
                        {category}
                      </span>
                    </div>

                    {/* PRODUCT NAME */}

                    <div
                      className="
                        mt-3
                        flex
                        h-[68px]
                        shrink-0
                        items-start
                        justify-center
                        px-3
                      "
                    >
                      <h2
                        className="
                          line-clamp-2
                          max-w-full
                          text-center
                          font-serif
                          text-[28px]
                          font-normal
                          leading-[1.1]
                          tracking-[-0.01em]
                          text-stone-900
                          transition-colors
                          duration-300
                          group-hover:text-stone-600
                        "
                      >
                        {displayName}
                      </h2>
                    </div>

                    {/* FLEXIBLE SPACE */}

                    <div className="flex-1 min-h-0" />

                    {/* PRICE */}

                    <div
                      className="
                        mt-auto
                        -translate-y-2
                        flex
                        h-[28px]
                        shrink-0
                        items-center
                        justify-center
                      "
                    >
                      <span
                        className="
                          text-[13px]
                          font-normal
                          tracking-[0.18em]
                          text-stone-600
                        "
                      >
                        ${product?.price ?? "0"}
                      </span>
                    </div>

                    {/* ==================================================
                        ACTION BUTTONS
                        EXACT SAME STRUCTURE AS ProductCard
                    ================================================== */}

                    <div
                      className="
                        mt-3
                        flex
                        h-[48px]
                        w-full
                        shrink-0
                        gap-2
                      "
                    >
                      {/* ADD TO BAG */}

                      <button
                        type="button"
                        onClick={(event) =>
                          handleAddToCart(
                            event,
                            product
                          )
                        }
                        className="
                          flex
                          h-full
                          flex-1
                          items-center
                          justify-center
                          border
                          border-black
                          bg-black
                          px-3
                          text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.2em]
                          text-white
                          transition-all
                          duration-300
                          hover:bg-stone-800
                        "
                      >
                        ADD TO BAG
                      </button>

                      {/* BUY NOW */}

                      <button
                        type="button"
                        onClick={(event) =>
                          handleBuyNow(
                            event,
                            product
                          )
                        }
                        className="
                          flex
                          h-full
                          flex-1
                          items-center
                          justify-center
                          border
                          border-stone-300
                          bg-white
                          px-3
                          text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.2em]
                          text-stone-800
                          transition-all
                          duration-300
                          hover:border-black
                          hover:bg-stone-50
                        "
                      >
                        BUY NOW
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default Wishlist;

