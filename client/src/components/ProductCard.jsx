import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const API_HOST = "https://avernus-api.onrender.com";

function ProductCard({ product }) {
  const { addToCart } = useShop();
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
        <div className="relative aspect-square w-full overflow-hidden bg-[#F8F7F4]">
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
              if (!event.currentTarget.src.includes("placeholder.png")) {
                event.currentTarget.src = "/placeholder.png";
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
          pt-6
        "
      >
        {/* ======================================================
            NEW ARRIVAL
            Fixed space so cards stay aligned.
            Text only — no background.
        ====================================================== */}
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

        {/* ======================================================
            BRAND + CATEGORY
        ====================================================== */}
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

        {/* ======================================================
            PRODUCT NAME
            Fixed height keeps names aligned.
        ====================================================== */}
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

        {/* ======================================================
            FLEXIBLE SPACE
            Keeps prices/buttons aligned across cards.
        ====================================================== */}
        <div className="flex-1 min-h-0" />

        {/* ======================================================
            PRICE
            Positioned slightly higher.
        ====================================================== */}
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

        {/* ======================================================
            ACTION BUTTONS
            Fixed height and slightly higher position.
        ====================================================== */}
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
}

export default ProductCard;