import { useNavigate } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
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
  // ============================================================

  const resolveImage = (src) => {
    if (!src || typeof src !== "string") {
      return "/placeholder.png";
    }

    const cleanSrc = src.trim();

    if (!cleanSrc) {
      return "/placeholder.png";
    }

    if (/^https?:\/\//i.test(cleanSrc)) {
      return cleanSrc;
    }

    return `${API_HOST}${cleanSrc.startsWith("/") ? "" : "/"}${cleanSrc}`;
  };

  // ============================================================
  // CATEGORY LABEL
  // ============================================================

  const getCategoryLabel = (category) => {
    const normalized = (category || "").trim().toLowerCase();

    if (normalized === "men") return "MASCULINE";
    if (normalized === "women") return "FEMININE";

    return "UNISEX";
  };

  // ============================================================
  // DISPLAY NAME
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
  // ============================================================

  const handleAddToCart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    if (!addToCart) return;

    addToCart(product);
  };

  // ============================================================
  // BUY NOW
  // ============================================================

  const handleBuyNow = (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    if (!addToCart) return;

    addToCart(product);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      <Navbar />

      {/* ========================================================
          HERO
      ======================================================== */}

      <section
        className="
          relative
          w-full
          min-h-[calc(100svh-64px)]
          md:min-h-[calc(100dvh-64px)]
          bg-white
          overflow-hidden
        "
      >
        <div
          className="
            min-h-[calc(100svh-64px)]
            md:min-h-[calc(100dvh-64px)]
            grid
            grid-cols-1
            md:grid-cols-2
          "
        >

          {/* ====================================================
              LEFT — TEXT
          ==================================================== */}

          <div
            className="
              relative
              flex
              items-center
              justify-center
              order-2
              md:order-1
              px-6
              sm:px-10
              md:px-12
              lg:px-20
              py-16
              md:py-20
              bg-white
              overflow-hidden
            "
          >
            <div
              className="
                w-full
                max-w-xl
                text-center
                md:text-left
                min-w-0
              "
            >

              <p
                className="
                  uppercase
                  tracking-[0.5em]
                  text-[9px]
                  sm:text-[10px]
                  text-stone-400
                  mb-5
                "
              >
                THE HOUSE OF AVERNUS
              </p>

              <p
                className="
                  uppercase
                  tracking-[0.3em]
                  text-[9px]
                  sm:text-[10px]
                  text-stone-500
                  mb-4
                "
              >
                YOUR SAVED FRAGRANCES
              </p>

              {/* MAIN TITLE */}

              <h1
                className="
                  font-serif
                  font-normal
                  text-[clamp(2.6rem,7vw,7rem)]
                  leading-none
                  tracking-[0.035em]
                  whitespace-nowrap
                  max-w-full
                "
              >
                WISHLIST
              </h1>

              <p
                className="
                  mt-7
                  max-w-md
                  mx-auto
                  md:mx-0
                  text-xs
                  sm:text-sm
                  leading-7
                  text-stone-500
                "
              >
                Keep the fragrances that have caught your attention
                close at hand, and return whenever you are ready
                to make them yours.
              </p>

              <div
                className="
                  flex
                  items-center
                  justify-center
                  md:justify-start
                  gap-4
                  mt-8
                "
              >
                <span className="w-10 h-px bg-black" />

                <span
                  className="
                    uppercase
                    tracking-[0.35em]
                    text-[8px]
                    text-stone-400
                  "
                >
                  AVERNUS
                </span>
              </div>

            </div>
          </div>

          {/* ====================================================
              RIGHT — HERO IMAGE
          ==================================================== */}

          <div
            className="
              relative
              order-1
              md:order-2
              h-[52vh]
              sm:h-[58vh]
              md:h-auto
              min-h-[420px]
              md:min-h-full
              bg-stone-100
              overflow-hidden
            "
          >

            <img
              src="/wishlist.jpg"
              alt="AVERNUS Wishlist"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                object-center
                select-none
              "
              draggable="false"
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/10
                via-transparent
                to-transparent
                pointer-events-none
              "
            />

            <div
              className="
                absolute
                left-5
                sm:left-7
                md:left-8
                bottom-5
                sm:bottom-7
                md:bottom-8
                text-white
              "
            >
              <p
                className="
                  uppercase
                  tracking-[0.35em]
                  text-[8px]
                  sm:text-[9px]
                "
              >
                AVERNUS
              </p>

              <p
                className="
                  mt-2
                  uppercase
                  tracking-[0.25em]
                  text-[8px]
                  text-white/70
                "
              >
                Your Selection
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          WISHLIST PRODUCTS
      ======================================================== */}

      <section
        className="
          px-4
          sm:px-6
          md:px-12
          lg:px-16
          py-14
          md:py-24
        "
      >

        {!wishlist || wishlist.length === 0 ? (

          /* ====================================================
             EMPTY WISHLIST
          ==================================================== */

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-20
              text-center
              px-6
            "
          >

            <Heart
              size={40}
              strokeWidth={1}
              className="text-stone-300 mb-6"
            />

            <h2
              className="
                font-serif
                text-3xl
                sm:text-4xl
                font-normal
              "
            >
              Your Wishlist Is Empty
            </h2>

            <p
              className="
                mt-4
                text-sm
                leading-6
                text-stone-500
                max-w-md
              "
            >
              Save the fragrances you love and come back
              to them whenever you're ready.
            </p>

            <button
              type="button"
              onClick={() => navigate("/collection")}
              className="
                mt-10
                bg-black
                text-white
                px-8
                sm:px-10
                py-4
                uppercase
                tracking-[0.3em]
                text-[10px]
                hover:bg-stone-800
                transition
              "
            >
              Explore The Collection
            </button>

          </div>

        ) : (

          /* ====================================================
             PRODUCTS
             
             MOBILE = 2 COLUMNS
             TABLET = 2 COLUMNS
             DESKTOP = 4 COLUMNS
          ==================================================== */

          <div
            className="
              max-w-7xl
              mx-auto
              grid
              grid-cols-2
              sm:grid-cols-2
              lg:grid-cols-4
              gap-x-4
              sm:gap-x-6
              md:gap-x-10
              gap-y-14
              sm:gap-y-16
              md:gap-y-20
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
                    min-w-0
                    flex-col
                    bg-white
                    text-black
                    cursor-pointer
                    overflow-hidden
                  "
                  onClick={() =>
                    navigate(`/product/${product._id}`)
                  }
                >

                  {/* ==================================================
                      PRODUCT IMAGE
                  ================================================== */}

                  <div
                    className="
                      relative
                      aspect-square
                      w-full
                      overflow-hidden
                      bg-[#F8F7F4]
                      shrink-0
                    "
                  >

                    {/* REMOVE BUTTON */}

                    <button
                      type="button"
                      onClick={(e) =>
                        handleRemove(e, product._id)
                      }
                      aria-label="Remove from wishlist"
                      className="
                        absolute
                        top-2
                        right-2
                        sm:top-4
                        sm:right-4
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
                        size={16}
                        strokeWidth={1.4}
                        className="sm:w-[19px] sm:h-[19px]"
                      />
                    </button>

                    {/* PRODUCT IMAGE */}

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
                      min-w-0
                      flex-col
                      pt-4
                      sm:pt-6
                    "
                  >

                    {/* ==================================================
                        NEW ARRIVAL

                        FIX:
                        Always reserves the same height.
                        It stays immediately below the image.
                    ================================================== */}

                    <div
                      className="
                        flex
                        h-[18px]
                        sm:h-[20px]
                        w-full
                        shrink-0
                        items-start
                        justify-center
                        overflow-hidden
                      "
                    >
                      {product?.isNew && (
                        <span
                          className="
                            block
                            max-w-full
                            truncate
                            whitespace-nowrap
                            text-center
                            text-[7px]
                            sm:text-[9px]
                            font-medium
                            uppercase
                            tracking-[0.18em]
                            sm:tracking-[0.3em]
                            text-stone-400
                          "
                        >
                          NEW ARRIVAL
                        </span>
                      )}
                    </div>

                    {/* ==================================================
                        BRAND + CATEGORY
                    ================================================== */}

                    <div
                      className="
                        mt-2
                        sm:mt-3
                        flex
                        h-[18px]
                        w-full
                        shrink-0
                        items-center
                        justify-center
                        gap-1
                        sm:gap-2
                        text-center
                        overflow-hidden
                        px-1
                      "
                    >

                      <span
                        className="
                          min-w-0
                          max-w-[48%]
                          truncate
                          whitespace-nowrap
                          text-[7px]
                          sm:text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.12em]
                          sm:tracking-[0.2em]
                          text-stone-500
                        "
                      >
                        {product?.brand || "AVERNUS"}
                      </span>

                      <span
                        className="
                          shrink-0
                          text-[8px]
                          sm:text-[10px]
                          text-stone-300
                        "
                      >
                        |
                      </span>

                      <span
                        className="
                          min-w-0
                          max-w-[48%]
                          truncate
                          whitespace-nowrap
                          text-[7px]
                          sm:text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.12em]
                          sm:tracking-[0.2em]
                          text-stone-400
                        "
                      >
                        {category}
                      </span>

                    </div>

                    {/* ==================================================
                        PRODUCT NAME
                    ================================================== */}

                    <div
                      className="
                        mt-2
                        sm:mt-3
                        flex
                        h-[54px]
                        sm:h-[68px]
                        w-full
                        shrink-0
                        items-start
                        justify-center
                        px-1
                        sm:px-3
                        overflow-hidden
                      "
                    >
                      <h2
                        className="
                          line-clamp-2
                          w-full
                          max-w-full
                          overflow-hidden
                          text-center
                          font-serif
                          text-[16px]
                          sm:text-[22px]
                          md:text-[28px]
                          font-normal
                          leading-[1.1]
                          tracking-[-0.01em]
                          text-stone-900
                          transition-colors
                          duration-300
                          group-hover:text-stone-600
                          break-words
                        "
                      >
                        {displayName}
                      </h2>
                    </div>

                    {/* FLEXIBLE SPACE */}

                    <div className="flex-1 min-h-2" />

                    {/* ==================================================
                        PRICE
                    ================================================== */}

                    <div
                      className="
                        mt-auto
                        -translate-y-1
                        sm:-translate-y-2
                        flex
                        h-[24px]
                        sm:h-[28px]
                        shrink-0
                        items-center
                        justify-center
                      "
                    >
                      <span
                        className="
                          text-[10px]
                          sm:text-[13px]
                          font-normal
                          tracking-[0.12em]
                          sm:tracking-[0.18em]
                          text-stone-600
                          whitespace-nowrap
                        "
                      >
                        ${product?.price ?? "0"}
                      </span>
                    </div>

                    {/* ==================================================
                        ACTION BUTTONS

                        MOBILE:
                        Both buttons remain on one row.
                    ================================================== */}

                    <div
                      className="
                        mt-2
                        sm:mt-3
                        flex
                        h-[42px]
                        sm:h-[48px]
                        w-full
                        shrink-0
                        gap-1
                        sm:gap-2
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
                          min-w-0
                          flex-1
                          items-center
                          justify-center
                          border
                          border-black
                          bg-black
                          px-1
                          sm:px-3
                          text-[7px]
                          sm:text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.08em]
                          sm:tracking-[0.2em]
                          text-white
                          transition-all
                          duration-300
                          hover:bg-stone-800
                          whitespace-nowrap
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
                          min-w-0
                          flex-1
                          items-center
                          justify-center
                          border
                          border-stone-300
                          bg-white
                          px-1
                          sm:px-3
                          text-[7px]
                          sm:text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.08em]
                          sm:tracking-[0.2em]
                          text-stone-800
                          transition-all
                          duration-300
                          hover:border-black
                          hover:bg-stone-50
                          whitespace-nowrap
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