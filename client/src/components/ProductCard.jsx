import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useShop } from "../context/ShopContext";

const API_HOST = "https://avernus-api.onrender.com";

function ProductCard({ product }) {
  const {
    addToCart,
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useShop();

  const navigate = useNavigate();

  // ============================================================
  // IMAGE RESOLVER
  // Supports Cloudflare R2 + old Render image paths
  // ============================================================
  const resolveImage = (src) => {
    if (!src || typeof src !== "string") {
      return "/placeholder.png";
    }

    const cleanSrc = src.trim();

    if (!cleanSrc) {
      return "/placeholder.png";
    }

    // Cloudflare R2 / complete image URL
    if (/^https?:\/\//i.test(cleanSrc)) {
      return cleanSrc;
    }

    // Old Render/backend image path
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
  // Removes "Pour Femme" visually only.
  // MongoDB product name remains unchanged.
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
  // WISHLIST STATUS
  // ============================================================
  const isWishlisted = wishlist?.some(
    (item) => item._id === product?._id
  );

  // ============================================================
  // TOGGLE WISHLIST
  // ============================================================
  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  // ============================================================
  // ADD TO BAG
  // ============================================================
  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(product);
  };

  // ============================================================
  // BUY NOW
  // ============================================================
  const handleBuyNow = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(product);
    navigate("/checkout");
  };

  const imageUrl = resolveImage(product?.image);
  const category = getCategoryLabel(product?.category);
  const displayName = getDisplayName(product?.name);

  return (
    <article
      className="
        group
        flex
        h-full
        min-h-full
        flex-col
        bg-white
        text-black
      "
    >
      {/* ========================================================
          PRODUCT IMAGE
      ======================================================== */}
      <Link
        to={`/product/${product._id}`}
        className="block shrink-0"
      >
        <div
          className="
            relative
            aspect-square
            w-full
            overflow-hidden
            bg-[#F8F7F4]
          "
        >
          {/* ====================================================
              WISHLIST HEART
          ==================================================== */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={
              isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className="
              absolute
              right-1.5
              top-1.5
              sm:right-4
              sm:top-4
              z-20
              flex
              h-7
              w-7
              sm:h-10
              sm:w-10
              items-center
              justify-center
              bg-transparent
              text-black
              transition-all
              duration-300
              hover:scale-110
            "
          >
            <Heart
              size={15}
              strokeWidth={1.5}
              className="sm:w-5 sm:h-5"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>

          <img
            src={imageUrl}
            alt={product?.name || "Avernus fragrance"}
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
      </Link>

      {/* ========================================================
          PRODUCT INFORMATION
      ======================================================== */}
      <div
        className="
          flex
          flex-1
          flex-col
          pt-3
          sm:pt-6
        "
      >
        {/* ======================================================
            NEW ARRIVAL
        ====================================================== */}
        <div
          className="
            flex
            h-[14px]
            sm:h-[20px]
            shrink-0
            items-start
            justify-center
          "
        >
          {product?.isNew && (
            <span
              className="
                text-[6px]
                sm:text-[9px]
                font-medium
                uppercase
                tracking-[0.15em]
                sm:tracking-[0.3em]
                text-stone-400
              "
            >
              NEW ARRIVAL
            </span>
          )}
        </div>

        {/* ======================================================
            BRAND + CATEGORY
        ====================================================== */}
        <div
          className="
            mt-1.5
            sm:mt-3
            flex
            h-[15px]
            sm:h-[18px]
            shrink-0
            items-center
            justify-center
            gap-1
            sm:gap-2
            text-center
          "
        >
          <span
            className="
              max-w-[45%]
              truncate
              text-[6px]
              sm:text-[10px]
              font-medium
              uppercase
              tracking-[0.08em]
              sm:tracking-[0.25em]
              text-stone-500
            "
          >
            {product?.brand || "AVERNUS"}
          </span>

          <span className="text-[7px] sm:text-[10px] text-stone-300">
            |
          </span>

          <span
            className="
              text-[6px]
              sm:text-[10px]
              font-medium
              uppercase
              tracking-[0.08em]
              sm:tracking-[0.25em]
              text-stone-400
            "
          >
            {category}
          </span>
        </div>

        {/* ======================================================
            PRODUCT NAME
        ====================================================== */}
        <div
          className="
            mt-1.5
            sm:mt-3
            flex
            h-[42px]
            sm:h-[68px]
            shrink-0
            items-start
            justify-center
            px-1
            sm:px-3
          "
        >
          <h2
            className="
              line-clamp-2
              max-w-full
              text-center
              font-serif
              text-[15px]
              sm:text-[28px]
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

        {/* ======================================================
            FLEXIBLE SPACE
        ====================================================== */}
        <div className="flex-1 min-h-0" />

        {/* ======================================================
            PRICE
        ====================================================== */}
        <div
          className="
            mt-auto
            -translate-y-1
            sm:-translate-y-2
            flex
            h-[20px]
            sm:h-[28px]
            shrink-0
            items-center
            justify-center
          "
        >
          <span
            className="
              text-[9px]
              sm:text-[13px]
              font-normal
              tracking-[0.08em]
              sm:tracking-[0.18em]
              text-stone-600
            "
          >
            ${product?.price ?? "0"}
          </span>
        </div>

        {/* ======================================================
            ACTION BUTTONS
        ====================================================== */}
        <div
          className="
            mt-2
            sm:mt-3
            flex
            h-[34px]
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
            onClick={handleAddToCart}
            className="
              flex
              h-full
              flex-1
              items-center
              justify-center
              border
              border-black
              bg-black
              px-1
              sm:px-3
              text-[6px]
              sm:text-[10px]
              font-medium
              uppercase
              tracking-[0.04em]
              sm:tracking-[0.2em]
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
            onClick={handleBuyNow}
            className="
              flex
              h-full
              flex-1
              items-center
              justify-center
              border
              border-stone-300
              bg-white
              px-1
              sm:px-3
              text-[6px]
              sm:text-[10px]
              font-medium
              uppercase
              tracking-[0.04em]
              sm:tracking-[0.2em]
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
}

export default ProductCard;