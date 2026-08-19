import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Check,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShop } from "../context/ShopContext";

/* ============================================================
   DEMO CATALOGUE
============================================================ */

const DEMO_PRODUCTS = [
  {
    _id: "avernus-aetheria",
    name: "Aetheria",
    brand: "AVERNUS",
    category: "women",
    concentration: "Eau de Parfum",
    price: 220,
    rating: 4.8,
    isNew: true,

    description:
      "A luminous opening of citrus and pear gives way to a heart of jasmine and iris, settling into a warm veil of white musk and cashmere wood.",

    story:
      "Aetheria began as a study of early morning light over the Mediterranean coast. Our perfumers spent two years refining the balance between the sheer citrus opening and the soft, skin-like musk base.",

    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citral.",

    notes: {
      top: ["Sicilian Bergamot", "Nashi Pear", "Pink Pepper"],
      heart: ["Jasmine Sambac", "Iris Root", "Orange Blossom"],
      base: ["White Musk", "Cashmere Wood", "Ambrette"],
    },

    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=2400&q=95&dpr=2",
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=2400&q=95&dpr=2",
    ],
  },

  {
    _id: "avernus-celestial-oud",
    name: "Celestial Oud",
    brand: "AVERNUS",
    category: "men",
    concentration: "Pure Oud Parfum",
    price: 340,
    rating: 4.9,
    isNew: true,

    description:
      "A commanding blend of rare oud, dark rose, and smoked woods. Rich, resinous, and unapologetically opulent.",

    story:
      "Sourced from sustainably managed Agarwood plantations, the oud at the heart of this composition is aged for depth before being paired with Bulgarian rose and incense.",

    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Eugenol, Benzyl Benzoate.",

    notes: {
      top: ["Saffron", "Black Pepper", "Bergamot"],
      heart: ["Bulgarian Rose", "Oud Wood", "Incense"],
      base: ["Amber", "Sandalwood", "Leather"],
    },

    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=2400&q=95&dpr=2",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=2400&q=95&dpr=2",
    ],
  },
];

const DEFAULT_NOTES = {
  top: ["—"],
  heart: ["—"],
  base: ["—"],
};

const SIZE_OPTIONS = [
  {
    label: "30ML",
    multiplier: 0.5,
  },
  {
    label: "50ML",
    multiplier: 0.72,
  },
  {
    label: "100ML",
    multiplier: 1,
  },
];

/* ============================================================
   DEMO PRODUCT
============================================================ */

function getDemoProduct(id) {
  return (
    DEMO_PRODUCTS.find(
      (product) => product._id === id
    ) || DEMO_PRODUCTS[0]
  );
}

/* ============================================================
   NORMALIZE PRODUCT
============================================================ */

function normalizeProduct(raw) {
  const fallback = getDemoProduct(raw._id);

  return {
    _id: raw._id,
    name: raw.name || fallback.name,
    brand: "AVERNUS",

    category:
      raw.category ||
      fallback.category ||
      "men",

    concentration:
      raw.concentration ||
      fallback.concentration,

    price:
      (typeof raw.price === "string"
        ? parseFloat(
            raw.price.replace(/[^0-9.]/g, "")
          )
        : Number(raw.price)) ||
      fallback.price,

    rating:
      raw.rating ||
      fallback.rating,

    isNew:
      raw.isNew ?? fallback.isNew,

    description:
      raw.description ||
      fallback.description,

    story:
      raw.story ||
      fallback.story,

    ingredients:
      raw.ingredients ||
      fallback.ingredients,

    notes:
      raw.notes ||
      fallback.notes ||
      DEFAULT_NOTES,

    images:
      raw.images?.length > 0
        ? raw.images
        : raw.image
        ? [raw.image]
        : fallback.images,
  };
}

/* ============================================================
   IMAGE RESOLVER
============================================================ */

function resolveImageSrc(src) {
  if (!src) return "/placeholder.jpg";

  if (src.startsWith("http")) {
    if (src.includes("images.unsplash.com")) {
      try {
        const url = new URL(src);

        url.searchParams.set("auto", "format");
        url.searchParams.set("fit", "crop");
        url.searchParams.set("w", "2400");
        url.searchParams.set("q", "95");
        url.searchParams.set("dpr", "2");

        return url.toString();
      } catch {
        return src;
      }
    }

    return src;
  }

  return `https://avernus-api.onrender.com/${src.replace(
    /^\/+/,
    ""
  )}`;
}

/* ============================================================
   PRODUCT DETAILS
============================================================ */

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    addToCart,
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useShop();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] =
    useState("50ML");

  const [activeImage, setActiveImage] =
    useState(0);

  const [justAdded, setJustAdded] =
    useState(false);

  /* ==========================================================
     LOAD PRODUCT
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setActiveImage(0);

    fetch(
      `https://avernus-api.onrender.com/api/products/${id}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Product not found");
        }

        return res.json();
      })
      .then((data) => {
        if (cancelled) return;

        const found =
          data.product ||
          data.data ||
          data;

        setProduct(
          found?.name
            ? normalizeProduct(found)
            : normalizeProduct(
                getDemoProduct(id)
              )
        );
      })
      .catch(() => {
        if (!cancelled) {
          setProduct(
            normalizeProduct(
              getDemoProduct(id)
            )
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="min-h-[calc(100svh-70px)] flex items-center justify-center">
          <p className="font-serif text-[10px] uppercase tracking-[0.5em] text-stone-400">
            Loading...
          </p>
        </div>

        <Footer />
      </div>
    );
  }

  /* ==========================================================
     DATA
  ========================================================== */

  const images = product.images || [];

  const sizeInfo =
    SIZE_OPTIONS.find(
      (size) =>
        size.label === selectedSize
    ) || SIZE_OPTIONS[1];

  const displayedPrice = Math.round(
    product.price *
      sizeInfo.multiplier
  );

  const category =
    product.category
      ?.trim()
      .toLowerCase();

  const gender =
    category === "women"
      ? "FEMININE"
      : "MASCULINE";

  const isWishlisted =
    wishlist?.some(
      (item) =>
        item._id === product._id
    ) || false;

  /* ==========================================================
     ADD TO BAG
  ========================================================== */

  const handleAddToBag = () => {
    const cartProduct = {
      ...product,
      _id: product._id,
      name: product.name,
      brand: product.brand,
      concentration:
        product.concentration,
      price: displayedPrice,
      image: images[0],
      selectedSize,
      qty: 1,
    };

    addToCart(cartProduct);

    setJustAdded(true);

    setTimeout(() => {
      setJustAdded(false);
    }, 1800);
  };

  /* ==========================================================
     BUY NOW
  ========================================================== */

  const handleBuyNow = () => {
    const cartProduct = {
      ...product,
      _id: product._id,
      name: product.name,
      brand: product.brand,
      concentration:
        product.concentration,
      price: displayedPrice,
      image: images[0],
      selectedSize,
      qty: 1,
    };

    addToCart(cartProduct);

    navigate("/checkout");
  };

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* ======================================================
          PRODUCT HERO
      ====================================================== */}

      <section
        className="
          relative
          w-full
          min-h-0
          md:min-h-[620px]
          md:h-[calc(100svh-64px)]
          md:max-h-[900px]
          overflow-hidden
          bg-black
        "
      >

        {/* ====================================================
            PRODUCT IMAGE
            MOBILE = CLEAR IMAGE
            DESKTOP = LEFT SIDE IMAGE
        ==================================================== */}

        <div
          className="
            relative
            w-full
            h-[58svh]
            min-h-[400px]
            md:absolute
            md:inset-y-0
            md:left-0
            md:w-[54%]
            md:h-full
            overflow-hidden
            bg-white
          "
        >
          <img
            key={resolveImageSrc(
              images[activeImage]
            )}
            src={resolveImageSrc(
              images[activeImage]
            )}
            alt={product.name}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 54vw"
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

          {/* ==================================================
              DESKTOP IMAGE SHADING ONLY
              NO MOBILE SHADOW
          ================================================== */}

          <div
            className="
              hidden
              md:block
              absolute
              inset-0
              bg-gradient-to-r
              from-black/5
              via-transparent
              to-black/20
              pointer-events-none
            "
          />
        </div>

        {/* ====================================================
            DESKTOP RIGHT SIDE DARK PANEL
        ==================================================== */}

        <div
          className="
            hidden
            md:block
            absolute
            inset-y-0
            right-0
            w-[46%]
            bg-black
          "
        />

        {/* ====================================================
            MOBILE PRODUCT INFORMATION
            BLACK AREA BELOW CLEAR IMAGE
        ==================================================== */}

        <div
          className="
            relative
            w-full
            bg-black
            md:absolute
            md:z-20
            md:left-[54%]
            md:right-0
            md:top-0
            md:bottom-0
            md:w-auto
            flex
            items-center
            px-5
            sm:px-8
            md:px-10
            lg:px-14
            py-8
            sm:py-10
            md:py-10
          "
        >
          <div className="w-full">

            {/* NEW */}
            <p
              className="
                uppercase
                tracking-[0.5em]
                text-[9px]
                md:text-[10px]
                text-white
                mb-3
              "
            >
              {product.isNew
                ? "NEW ARRIVAL"
                : "AVERNUS"}
            </p>

            {/* GENDER */}
            <p
              className="
                uppercase
                tracking-[0.3em]
                text-[9px]
                md:text-[10px]
                text-white/60
                mb-3
              "
            >
              {gender}
            </p>

            {/* BRAND */}
            <p
              className="
                uppercase
                tracking-[0.3em]
                text-[9px]
                md:text-[10px]
                text-white/80
                mb-2
              "
            >
              {product.brand}
            </p>

            {/* NAME */}
            <h1
              className="
                font-serif
                font-normal
                text-4xl
                sm:text-5xl
                md:text-5xl
                lg:text-6xl
                leading-none
                tracking-[0.04em]
                text-white
              "
            >
              {product.name}
            </h1>

            {/* PRICE */}
            <p
              className="
                mt-4
                text-xs
                md:text-sm
                uppercase
                tracking-[0.25em]
                font-light
                text-white
              "
            >
              ${displayedPrice}
            </p>

            {/* SIZE */}
            <div
              className="
                flex
                gap-2
                mt-5
              "
            >
              {SIZE_OPTIONS.map(
                (size) => (
                  <button
                    key={size.label}
                    type="button"
                    onClick={() =>
                      setSelectedSize(
                        size.label
                      )
                    }
                    className={`
                      px-4
                      sm:px-5
                      py-2
                      border
                      uppercase
                      tracking-[0.15em]
                      text-[8px]
                      sm:text-[9px]
                      transition
                      ${
                        selectedSize ===
                        size.label
                          ? "bg-white text-black border-white"
                          : "border-white/50 text-white hover:bg-white/10"
                      }
                    `}
                  >
                    {size.label}
                  </button>
                )
              )}
            </div>

            {/* ACTIONS */}
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
                mt-5
              "
            >

              {/* ADD TO BAG */}
              <button
                type="button"
                onClick={
                  handleAddToBag
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-white
                  text-black
                  px-5
                  sm:px-7
                  py-3
                  md:py-3.5
                  uppercase
                  tracking-[0.2em]
                  text-[8px]
                  sm:text-[9px]
                  font-medium
                  hover:bg-stone-100
                  transition
                "
              >
                {justAdded ? (
                  <>
                    <Check
                      size={14}
                    />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingBag
                      size={14}
                    />
                    Add to Bag
                  </>
                )}
              </button>

              {/* BUY NOW */}
              <button
                type="button"
                onClick={
                  handleBuyNow
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  border
                  border-white
                  text-white
                  px-5
                  sm:px-7
                  py-3
                  md:py-3.5
                  uppercase
                  tracking-[0.2em]
                  text-[8px]
                  sm:text-[9px]
                  hover:bg-white
                  hover:text-black
                  transition
                "
              >
                Buy Now
              </button>

              {/* WISHLIST */}
              <button
                type="button"
                onClick={() =>
                  isWishlisted
                    ? removeFromWishlist(
                        product._id
                      )
                    : addToWishlist(
                        product
                      )
                }
                aria-label={
                  isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                className={`
                  w-[42px]
                  h-[42px]
                  md:w-[46px]
                  md:h-[46px]
                  flex
                  items-center
                  justify-center
                  border
                  transition
                  ${
                    isWishlisted
                      ? "bg-white text-black border-white"
                      : "border-white/50 text-white hover:bg-white hover:text-black"
                  }
                `}
              >
                <Heart
                  size={16}
                  className={
                    isWishlisted
                      ? "fill-current"
                      : ""
                  }
                />
              </button>
            </div>
          </div>
        </div>

        {/* ====================================================
            THUMBNAILS
        ==================================================== */}

        {images.length > 1 && (
          <div
            className="
              absolute
              right-4
              md:right-[47%]
              top-[29%]
              md:top-1/2
              -translate-y-1/2
              z-30
              flex
              flex-col
              gap-2
            "
          >
            {images.map(
              (image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setActiveImage(
                      index
                    )
                  }
                  className={`
                    w-10
                    h-10
                    md:w-12
                    md:h-12
                    overflow-hidden
                    border
                    transition
                    bg-white/20
                    ${
                      activeImage ===
                      index
                        ? "border-black md:border-white"
                        : "border-black/30 md:border-white/30"
                    }
                  `}
                >
                  <img
                    src={resolveImageSrc(
                      image
                    )}
                    alt={`${product.name} ${
                      index + 1
                    }`}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />
                </button>
              )
            )}
          </div>
        )}
      </section>

      {/* ======================================================
          PRODUCT INFORMATION
      ====================================================== */}

      <section
        className="
          max-w-6xl
          mx-auto
          px-5
          sm:px-8
          md:px-12
          py-16
          md:py-24
        "
      >

        {/* ====================================================
            INTRO
        ==================================================== */}

        <div
          className="
            max-w-3xl
            mx-auto
            text-center
          "
        >
          <p
            className="
              uppercase
              tracking-[0.45em]
              text-[9px]
              md:text-[10px]
              text-stone-400
            "
          >
            {product.concentration}
          </p>

          <h2
            className="
              mt-4
              font-serif
              text-2xl
              md:text-3xl
              font-normal
              tracking-wide
            "
          >
            The Essence of{" "}
            {product.name}
          </h2>

          <p
            className="
              mt-5
              text-xs
              md:text-sm
              text-stone-500
              leading-7
              max-w-2xl
              mx-auto
            "
          >
            {product.description}
          </p>
        </div>

        {/* ====================================================
            NOTES
        ==================================================== */}

        <div className="mt-14 md:mt-20">

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-4
              md:gap-5
            "
          >

            {/* TOP NOTES */}
            <div
              className="
                bg-stone-50
                px-6
                md:px-8
                py-8
                md:py-10
                min-h-[230px]
              "
            >
              <p
                className="
                  uppercase
                  tracking-[0.3em]
                  text-[9px]
                  text-stone-400
                "
              >
                Top Notes
              </p>

              <h3
                className="
                  mt-3
                  font-serif
                  text-xl
                  md:text-2xl
                  font-normal
                "
              >
                First Impression
              </h3>

              <div className="mt-6 space-y-2">
                {product.notes.top?.map(
                  (note, index) => (
                    <p
                      key={index}
                      className="
                        text-xs
                        md:text-sm
                        text-stone-600
                      "
                    >
                      {note}
                    </p>
                  )
                )}
              </div>
            </div>

            {/* HEART NOTES */}
            <div
              className="
                bg-stone-50
                px-6
                md:px-8
                py-8
                md:py-10
                min-h-[230px]
              "
            >
              <p
                className="
                  uppercase
                  tracking-[0.3em]
                  text-[9px]
                  text-stone-400
                "
              >
                Heart Notes
              </p>

              <h3
                className="
                  mt-3
                  font-serif
                  text-xl
                  md:text-2xl
                  font-normal
                "
              >
                The Character
              </h3>

              <div className="mt-6 space-y-2">
                {product.notes.heart?.map(
                  (note, index) => (
                    <p
                      key={index}
                      className="
                        text-xs
                        md:text-sm
                        text-stone-600
                      "
                    >
                      {note}
                    </p>
                  )
                )}
              </div>
            </div>

            {/* BASE NOTES */}
            <div
              className="
                bg-stone-50
                px-6
                md:px-8
                py-8
                md:py-10
                min-h-[230px]
              "
            >
              <p
                className="
                  uppercase
                  tracking-[0.3em]
                  text-[9px]
                  text-stone-400
                "
              >
                Base Notes
              </p>

              <h3
                className="
                  mt-3
                  font-serif
                  text-xl
                  md:text-2xl
                  font-normal
                "
              >
                The Signature
              </h3>

              <div className="mt-6 space-y-2">
                {product.notes.base?.map(
                  (note, index) => (
                    <p
                      key={index}
                      className="
                        text-xs
                        md:text-sm
                        text-stone-600
                      "
                    >
                      {note}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ==================================================
              STORY / INGREDIENTS / SHIPPING
          ================================================== */}

          <div className="h-6 md:h-8" />

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-4
              md:gap-5
            "
          >

            {/* STORY */}
            <div
              className="
                bg-stone-50
                px-6
                md:px-8
                py-8
                md:py-10
                min-h-[250px]
              "
            >
              <p
                className="
                  uppercase
                  tracking-[0.3em]
                  text-[9px]
                  text-stone-400
                "
              >
                The Story
              </p>

              <h3
                className="
                  mt-3
                  font-serif
                  text-xl
                  md:text-2xl
                  font-normal
                "
              >
                The Inspiration
              </h3>

              <p
                className="
                  mt-6
                  text-xs
                  md:text-sm
                  text-stone-600
                  leading-7
                "
              >
                {product.story}
              </p>
            </div>

            {/* INGREDIENTS */}
            <div
              className="
                bg-stone-50
                px-6
                md:px-8
                py-8
                md:py-10
                min-h-[250px]
              "
            >
              <p
                className="
                  uppercase
                  tracking-[0.3em]
                  text-[9px]
                  text-stone-400
                "
              >
                Ingredients
              </p>

              <h3
                className="
                  mt-3
                  font-serif
                  text-xl
                  md:text-2xl
                  font-normal
                "
              >
                The Composition
              </h3>

              <p
                className="
                  mt-6
                  text-xs
                  md:text-sm
                  text-stone-600
                  leading-7
                "
              >
                {product.ingredients}
              </p>
            </div>

            {/* SHIPPING */}
            <div
              className="
                bg-stone-50
                px-6
                md:px-8
                py-8
                md:py-10
                min-h-[250px]
              "
            >
              <p
                className="
                  uppercase
                  tracking-[0.3em]
                  text-[9px]
                  text-stone-400
                "
              >
                Shipping & Returns
              </p>

              <h3
                className="
                  mt-3
                  font-serif
                  text-xl
                  md:text-2xl
                  font-normal
                "
              >
                Delivery
              </h3>

              <p
                className="
                  mt-6
                  text-xs
                  md:text-sm
                  text-stone-600
                  leading-7
                "
              >
                Complimentary shipping
                on all orders. Returns
                are accepted within 30
                days of delivery, provided
                the fragrance seal remains
                intact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ProductDetails;